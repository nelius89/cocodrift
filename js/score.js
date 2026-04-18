// ─────────────────────────────────────────
// SCORE — Sistema de diagnóstico
// ─────────────────────────────────────────

function kmhToKnots(kmh) {
  return kmh / 1.852;
}

function degreesToCardinal(deg) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO'];
  return dirs[Math.round(deg / 22.5) % 16];
}

// Devuelve nivel de riesgo terral: 0 (ninguno) · 1 (leve) · 2 (relevante) · 3 (desaconsejable)
function calcularRiesgoTerral(windKn, gustKn, windDir, waveH, spot) {
  const [min, max] = spot.offshore_range;
  if (windDir < min || windDir > max) return 0;

  let level;
  if (windKn < 6 && gustKn < 10) {
    level = 1;
  } else if (windKn > 10 || (gustKn > 16 && windKn >= 6)) {
    level = 3;
  } else {
    level = 2;
  }

  // Modificador de ola: +1 si ola > 0.6 m y spot no protegido
  if (waveH > 0.6 && !spot.protected) {
    level = Math.min(level + 1, 3);
  }

  return level;
}

// ── Sub-scores ──
function scoreViento(kn) {
  if (kn <= 6)  return 10;
  if (kn <= 10) return 8;
  if (kn <= 14) return 5;
  if (kn <= 19) return 3;
  return 0;
}

function scoreOla(m) {
  if (m <= 0.3) return 10;
  if (m <= 0.6) return 8;
  if (m <= 1.0) return 5;
  if (m <= 1.5) return 2;
  return 0;
}

function scoreRacha(kn) {
  if (kn <= 8)  return 10;
  if (kn <= 12) return 7;
  if (kn <= 16) return 4;
  if (kn <= 20) return 2;
  return 0;
}

function scorePeriodo(s) {
  if (s >= 7) return 10;
  if (s >= 5) return 8;
  if (s >= 4) return 6;
  return 3;
}

function scoreNubes(pct) {
  if (pct <= 20) return 10;
  if (pct <= 50) return 8;
  if (pct <= 80) return 6;
  return 5;
}

function calcularScore(viento_kn, ola_m, racha_kn, periodo_s, nubes_pct) {
  return (
    scoreViento(viento_kn)  * 0.35 +
    scoreOla(ola_m)         * 0.35 +
    scoreRacha(racha_kn)    * 0.15 +
    scorePeriodo(periodo_s) * 0.10 +
    scoreNubes(nubes_pct)   * 0.05
  );
}

// ── Estado según score ──
function getEstado(score, weathercode) {
  if (weathercode >= 95) return 'no-salir';
  if (score >= 8.5) return 'perfecto';
  if (score >= 7.0) return 'bueno';
  if (score >= 5.0) return 'aceptable';
  if (score >= 3.0) return 'complicado';
  return 'no-salir';
}

const ESTADOS = {
  'perfecto':   { titulo: 'Hoy es de los buenos',              subtitulo: 'Yo no me lo perdería' },
  'bueno':      { titulo: 'Hoy se puede salir',                subtitulo: 'Si te apetece, se está a gusto' },
  'aceptable':  { titulo: 'Hoy, depende...',                   subtitulo: 'Solo si estás acostumbrado' },
  'complicado': { titulo: 'Mejor otro día',                    subtitulo: 'Hoy lo dejaría' },
  'no-salir':   { titulo: 'Hoy mejor quedarse en casa',        subtitulo: 'No está el agua para nadie' },
};

// ── Resumen corto para la pantalla principal (2-3 frases) ──
function buildSummary(d, estado) {
  // Viento — intensidad + estabilidad en una sola frase
  let wind;
  if      (d.windKn <= 6  && d.gustKn <= 8)  wind = 'Viento muy suave y constante.';
  else if (d.windKn <= 6  && d.gustKn <= 12) wind = 'Viento suave, con alguna racha.';
  else if (d.windKn <= 6)                    wind = 'Viento suave pero rachas notables.';
  else if (d.windKn <= 10 && d.gustKn <= 12) wind = 'Brisa ligera, bastante estable.';
  else if (d.windKn <= 10)                   wind = 'Brisa ligera con rachas.';
  else if (d.windKn <= 14)                   wind = 'Viento moderado. Remar cuesta.';
  else if (d.windKn <= 19)                   wind = 'Viento fuerte.';
  else                                        wind = 'Viento muy fuerte.';

  // Mar — ola + período en una sola frase
  let sea;
  if      (d.waveH <= 0.3 && d.wavePer >= 5)  sea = 'Mar plano y tranquilo.';
  else if (d.waveH <= 0.3)                     sea = 'Mar plano pero algo nervioso.';
  else if (d.waveH <= 0.6 && d.wavePer >= 5)  sea = 'Olas muy pequeñas y ordenadas.';
  else if (d.waveH <= 0.6)                     sea = 'Olas pequeñas, algo irregulares.';
  else if (d.waveH <= 1.0 && d.wavePer >= 5)  sea = 'Olas medias, mar movido.';
  else if (d.waveH <= 1.0)                     sea = 'Mar movido y algo agitado.';
  else if (d.waveH <= 1.5)                     sea = 'Olas grandes. Equilibrio difícil.';
  else                                          sea = 'Mar muy movido.';

  const cierres = {
    'perfecto':   'Condiciones ideales para salir.',
    'bueno':      'Condiciones cómodas en general.',
    'aceptable':  'Puedes salir, pero con atención.',
    'complicado': 'Condiciones exigentes hoy.',
    'no-salir':   'Mejor no meterse hoy.',
  };

  return `${wind} ${sea} ${cierres[estado]}`;
}

// ── Bloques interpretativos para el sheet (viento unificado + mar unificado) ──
// Devuelve { windTitle, windDesc, seaTitle, seaDesc, closing }
function buildBlocks(d, estado) {
  // Bloque viento — intensidad + rachas en título y consecuencia separados
  let windTitle, windDesc;
  if      (d.windKn <= 6  && d.gustKn <= 8)  { windTitle = 'El viento sopla muy suave y constante.';              windDesc = 'No lo vas a notar al remar.'; }
  else if (d.windKn <= 6  && d.gustKn <= 12) { windTitle = 'El viento sopla suave, con alguna racha puntual.';    windDesc = 'Nada que vaya a molestarte al remar.'; }
  else if (d.windKn <= 6)                    { windTitle = 'El viento base es suave, pero las rachas son notables.'; windDesc = 'Vigila los empujones bruscos que pueden pillarte descolocado.'; }
  else if (d.windKn <= 10 && d.gustKn <= 12) { windTitle = 'Hay una brisa ligera y bastante estable.';            windDesc = 'Se nota un poco al remar, pero no molesta.'; }
  else if (d.windKn <= 10)                   { windTitle = 'Hay una brisa ligera con algunas rachas.';            windDesc = 'Puede pillarte descolocado de vez en cuando.'; }
  else if (d.windKn <= 14 && d.gustKn <= 16) { windTitle = 'Viento moderado, sin rachas muy bruscas.';            windDesc = 'Remar contra él empieza a costar. Exige más esfuerzo.'; }
  else if (d.windKn <= 14)                   { windTitle = 'Viento moderado con rachas fuertes.';                 windDesc = 'Puede desestabilizarte con facilidad. Mantén una posición baja.'; }
  else if (d.windKn <= 19)                   { windTitle = 'El viento fuerte va a cansarte rápido.';              windDesc = 'Las rachas pueden tirarte o alejarte sin que te des cuenta.'; }
  else                                        { windTitle = 'El viento es demasiado fuerte para salir.';          windDesc = 'No es seguro estar en el agua con estas condiciones.'; }

  // Bloque mar — ola + período en título y consecuencia separados
  let seaTitle, seaDesc;
  if      (d.waveH <= 0.3 && d.wavePer >= 5)  { seaTitle = 'Las olas son muy pequeñas y el mar está tranquilo.';    seaDesc = 'Apenas notarás movimiento. Como remar en una piscina.'; }
  else if (d.waveH <= 0.3)                     { seaTitle = 'El mar está plano, con olas cortas y algo nerviosas.';  seaDesc = 'Puede haber algún movimiento irregular puntual.'; }
  else if (d.waveH <= 0.6 && d.wavePer >= 5)  { seaTitle = 'Las olas son pequeñas y llevan un ritmo ordenado.';     seaDesc = 'Habrá algo de balanceo, pero predecible y fácil de manejar.'; }
  else if (d.waveH <= 0.6)                     { seaTitle = 'Olas pequeñas con un ritmo algo irregular.';            seaDesc = 'Puede haber algún movimiento inesperado de vez en cuando.'; }
  else if (d.waveH <= 1.0 && d.wavePer >= 5)  { seaTitle = 'Hay movimiento real, con olas medias y ritmo regular.'; seaDesc = 'Necesitarás equilibrio. El mar está vivo pero predecible.'; }
  else if (d.waveH <= 1.0)                     { seaTitle = 'Mar movido, con olas medias y ritmo irregular.';        seaDesc = 'Mantenerse de pie exige concentración. Espera sorpresas.'; }
  else if (d.waveH <= 1.5)                     { seaTitle = 'Las olas son grandes y el mar está agitado.';           seaDesc = 'Difícil mantenerse estable. Solo para remadores con experiencia.'; }
  else                                          { seaTitle = 'El mar está muy movido y las olas son peligrosas.';    seaDesc = 'No apto para paddle surf recreativo hoy.'; }

  const cierres = {
    'perfecto':   'Un día ideal para salir y disfrutar sin esfuerzo.',
    'bueno':      'Un buen día para salir. Las condiciones acompañan.',
    'aceptable':  'Puedes salir, pero necesitarás más atención de lo habitual.',
    'complicado': 'No es un buen día para la tabla. Mejor esperarlo en tierra.',
    'no-salir':   'Hoy es mejor quedarse en tierra.',
  };

  return { windTitle, windDesc, seaTitle, seaDesc, closing: cierres[estado] };
}

// ── Etiquetas métricas ──
function labelViento(kn) {
  if (kn <= 6)  return { label: 'Calma total',     phrase: 'No lo notarás ni en el pelo.' };
  if (kn <= 10) return { label: 'Brisa ligera',    phrase: 'Se nota pero no molesta.' };
  if (kn <= 14) return { label: 'Viento moderado', phrase: 'Remar contra él ya cuesta.' };
  if (kn <= 19) return { label: 'Viento fuerte',   phrase: 'El mar está revuelto.' };
  return        { label: 'Demasiado viento',        phrase: 'No es seguro estar en el agua.' };
}

function labelOla(m) {
  if (m <= 0.3) return { label: 'Plana',       phrase: 'Como una piscina. Sin movimiento.' };
  if (m <= 0.6) return { label: 'Pequeña',     phrase: 'Algo de balanceo. Agradable.' };
  if (m <= 1.0) return { label: 'Mediana',     phrase: 'Te mueve. Necesitas equilibrio.' };
  if (m <= 1.5) return { label: 'Grande',      phrase: 'Difícil mantenerse de pie.' };
  return        { label: 'Muy grande',          phrase: 'Peligroso para SUP recreativo.' };
}

function labelRacha(kn) {
  if (kn <= 8)  return { label: 'Estable',          phrase: 'Sin sorpresas. El viento es constante.' };
  if (kn <= 12) return { label: 'Alguna racha',      phrase: 'Pequeños empujones puntuales.' };
  if (kn <= 16) return { label: 'Rachas fuertes',    phrase: 'Pueden pillarte descolocado.' };
  return        { label: 'Rachas peligrosas',         phrase: 'Una racha puede echarte al agua lejos de la orilla.' };
}

function labelPeriodo(s) {
  if (s <= 3) return { label: 'Ola caótica',    phrase: 'Corta y desordenada. El mar está nervioso.' };
  if (s <= 6) return { label: 'Ola normal',     phrase: 'Ritmo normal. Manejable.' };
  return      { label: 'Ola organizada',         phrase: 'Ola larga y predecible. La mejor.' };
}

function labelTemp(c) {
  if (c <= 16) return 'Fresquito';
  if (c <= 20) return 'Templado';
  if (c <= 25) return 'Agradable';
  if (c <= 30) return 'Calor';
  return 'Mucho calor';
}

function labelDireccion(degrees) {
  const card = degreesToCardinal(degrees);
  // Onshore para BCN/Badalona: viento del E/SE (llega del mar)
  // Offshore: O/NO [225-315]
  if (degrees >= 225 && degrees <= 315) {
    return { label: `${card} · Viento terral`, phrase: 'Parece tranquilo pero te aleja del mar. ¡Cuidado!' };
  }
  if ((degrees >= 45 && degrees <= 135)) {
    return { label: `${card} · Viento de mar`, phrase: 'Empuja hacia la orilla. Sin riesgo de alejarte.' };
  }
  return { label: `${card} · Lateral`, phrase: 'El más neutro. Solo vigila la deriva.' };
}
