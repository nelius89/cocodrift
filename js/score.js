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
  'perfecto':   { titulo: 'Hoy es perfecto para salir',    desc: '' },
  'bueno':      { titulo: 'Puedes salir sin problema',      desc: '' },
  'aceptable':  { titulo: 'Puedes salir, pero ojo',         desc: '' },
  'complicado': { titulo: 'Mejor no meterse hoy',           desc: '' },
  'no-salir':   { titulo: 'Hoy no salgas',                  desc: '' },
};

function buildParagraph(d, estado) {
  const f = [];

  // Viento
  if      (d.windKn <= 6)  f.push('El viento sopla muy suave, así que no lo vas a notar al remar.');
  else if (d.windKn <= 10) f.push('Hay una brisa ligera, se nota un poco pero no molesta.');
  else if (d.windKn <= 14) f.push('El viento ya es moderado, remar contra él empieza a costar.');
  else if (d.windKn <= 19) f.push('El viento es fuerte, te va a desestabilizar y cansar rápido.');
  else                     f.push('El viento es demasiado fuerte, no es seguro estar en el agua.');

  // Olas
  if      (d.waveH <= 0.3) f.push('Las olas son muy pequeñas, apenas notarás movimiento.');
  else if (d.waveH <= 0.6) f.push('Hay algo de ola, notarás un ligero balanceo.');
  else if (d.waveH <= 1.0) f.push('El mar tiene movimiento, necesitarás equilibrio.');
  else if (d.waveH <= 1.5) f.push('Las olas son grandes, mantenerse estable es difícil.');
  else                     f.push('El mar está muy movido, no es apto para paddle surf recreativo.');

  // Rachas
  if      (d.gustKn <= 8)  f.push('El viento es bastante estable, sin cambios bruscos.');
  else if (d.gustKn <= 12) f.push('Hay algunas rachas, con empujones puntuales.');
  else if (d.gustKn <= 16) f.push('Las rachas son fuertes, pueden pillarte descolocado.');
  else                     f.push('Las rachas son peligrosas, pueden tirarte o alejarte.');

  // Período
  if      (d.wavePer < 4)  f.push('El mar está desordenado, con olas cortas y caóticas.');
  else if (d.wavePer <= 6) f.push('El mar tiene un ritmo normal, bastante manejable.');
  else                     f.push('El mar está ordenado, con olas largas y predecibles.');

  // Dirección
  if      (d.windDir >= 225 && d.windDir <= 315) f.push('El viento empuja mar adentro sin que lo notes.');
  else if (d.windDir >= 45  && d.windDir <= 135) f.push('El viento empuja hacia la orilla, sin riesgo de alejarte.');
  else                                           f.push('El viento es lateral, solo tendrás que corregir la deriva.');

  // Conclusión
  const conclusiones = {
    'perfecto':   'En conjunto, es un día ideal para salir y disfrutar sin esfuerzo.',
    'bueno':      'En conjunto, es un buen día para salir con comodidad.',
    'aceptable':  'En conjunto, puedes salir, pero te exigirá más atención.',
    'complicado': 'En conjunto, no es un buen día para meterse con la tabla.',
    'no-salir':   'En conjunto, es mejor no meterse en el agua hoy.',
  };
  f.push(conclusiones[estado]);

  return f.join(' ');
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
