// ─────────────────────────────────────────
// SCORE — Sistema de diagnóstico v2
// Paradigma: reglas directas por variable (no scoring ponderado)
// Docs: docs/sistema-diagnostico.md
// ─────────────────────────────────────────

function kmhToKnots(kmh) {
  return kmh / 1.852;
}

function degreesToCardinal(deg) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO'];
  return dirs[Math.round(deg / 22.5) % 16];
}

// ── Terral ──
// Devuelve nivel de riesgo: 0 (ninguno) · 1 (leve) · 2 (relevante) · 3 (fuerte)
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

// ── Variabilidad ──
// Mide la inestabilidad del viento. No existe en literatura técnica de SUP —
// es una variable propia de Cocodrift basada en física real.
function calcularVariabilidad(windKn, gustKn) {
  return Math.max(0, gustKn - windKn);
}

// ── Copy de avisos ──
// Cada aviso tiene: label visible, categoría de gravedad y texto explicativo.
//
// Categorías:
//   narrativa        → se absorbe en buildBlocks(), no genera bloque propio
//   a-tener-en-cuenta → bloque discreto, informativo
//   cuidado          → bloque medio, afecta la experiencia
//   alerta           → bloque prominente, implica riesgo real
//
// Tabla tipo/nivel → categoría:
//   rachas:      1=narrativa · 2=a-tener-en-cuenta · 3=alerta
//   variabilidad:1=narrativa · 2=a-tener-en-cuenta · 3=cuidado
//   mar:         1=narrativa · 2=a-tener-en-cuenta · 3=cuidado
//   terral:      1=a-tener-en-cuenta · 2=cuidado · 3=alerta
const AVISOS_COPY = {
  rachas: {
    1: {
      label: 'Alguna racha notable',
      categoria: 'narrativa',
      copy: null, // absorbido en buildBlocks
    },
    2: {
      label: 'Rachas fuertes',
      categoria: 'a-tener-en-cuenta',
      copy: 'Las rachas son más fuertes que el viento base. Pueden pillarte descolocado — mantén una postura baja y estable.',
    },
    3: {
      label: 'Rachas muy fuertes',
      categoria: 'alerta',
      copy: 'Las rachas son peligrosas aunque el viento parezca tranquilo. Una racha puede empujarte lejos de la orilla o tirarte al agua.',
    },
  },
  variabilidad: {
    1: {
      label: 'Viento algo variable',
      categoria: 'narrativa',
      copy: null,
    },
    2: {
      label: 'Viento inestable',
      categoria: 'a-tener-en-cuenta',
      copy: 'El viento cambia de intensidad con frecuencia. No es fuerte, pero no es constante — estate atento.',
    },
    3: {
      label: 'Viento muy inestable',
      categoria: 'cuidado',
      copy: 'El viento base es suave, pero los cambios son bruscos y frecuentes. Puede descolocarte cuando menos te lo esperas.',
    },
  },
  mar: {
    1: {
      label: 'Mar algo nervioso',
      categoria: 'narrativa',
      copy: null,
    },
    2: {
      label: 'Mar incómodo',
      categoria: 'a-tener-en-cuenta',
      copy: 'Las olas son cortas y poco organizadas. El equilibrio va a costar más de lo que el tamaño sugiere.',
    },
    3: {
      label: 'Mar muy incómodo',
      categoria: 'cuidado',
      copy: 'El mar está muy nervioso. Las olas son pequeñas pero caóticas — mantenerse de pie exige concentración constante.',
    },
  },
  terral: {
    1: {
      label: 'Terral leve',
      categoria: 'a-tener-en-cuenta',
      copy: 'El viento viene de tierra. Hoy es suave, pero te empuja hacia el mar. No te alejes demasiado de la orilla.',
    },
    2: {
      label: 'Terral relevante',
      categoria: 'cuidado',
      copy: 'El viento de tierra empuja hacia mar abierto. Quédate cerca de la orilla en todo momento. Si tienes dudas, mejor no salir hoy.',
    },
    3: {
      label: 'Terral fuerte',
      categoria: 'alerta',
      copy: 'El viento de tierra empuja fuerte hacia mar abierto. El agua puede parecer tranquila desde la orilla — no lo es. Hoy es mejor quedarse en tierra.',
    },
  },
};

// ── Avisos ──
// Devuelve array de { tipo, nivel, label, categoria, copy }
// Los de categoría 'narrativa' se absorben en buildBlocks(), no se renderizan como bloque.
function getWarnings(d, terralLevel) {
  const variabilidad = calcularVariabilidad(d.windKn, d.gustKn);
  const warnings = [];

  // Rachas
  const nivelRachas = d.gustKn > 22 ? 3 : d.gustKn > 16 ? 2 : d.gustKn > 12 ? 1 : 0;
  if (nivelRachas > 0) {
    warnings.push({ tipo: 'rachas', nivel: nivelRachas, ...AVISOS_COPY.rachas[nivelRachas] });
  }

  // Variabilidad
  const nivelVar = variabilidad > 10 ? 3 : variabilidad > 6 ? 2 : variabilidad > 4 ? 1 : 0;
  if (nivelVar > 0) {
    warnings.push({ tipo: 'variabilidad', nivel: nivelVar, ...AVISOS_COPY.variabilidad[nivelVar] });
  }

  // Mar incómodo (período + ola combinados)
  const nivelMar = (d.wavePer < 3 && d.waveH > 0.5) ? 3
                 : (d.wavePer < 4 && d.waveH > 0.5) ? 2
                 : (d.wavePer < 5 && d.waveH > 0.5) ? 1 : 0;
  if (nivelMar > 0) {
    warnings.push({ tipo: 'mar', nivel: nivelMar, ...AVISOS_COPY.mar[nivelMar] });
  }

  // Terral
  if (terralLevel > 0) {
    warnings.push({ tipo: 'terral', nivel: terralLevel, ...AVISOS_COPY.terral[terralLevel] });
  }

  return warnings;
}

// ── Estado base ──
// Reglas directas por variable. El orden importa: del peor al mejor.
function calcEstadoBase(d, weathercode, terralLevel) {
  const variabilidad = calcularVariabilidad(d.windKn, d.gustKn);

  // Tormenta → siempre no recomendable
  if (weathercode >= 95) return 'no-recomendable';

  // No recomendable — cualquiera de estas condiciones
  if (d.windKn > 20)                            return 'no-recomendable';
  if (d.gustKn > 28)                            return 'no-recomendable';
  if (d.waveH > 1.5)                            return 'no-recomendable';
  if (d.wavePer < 3 && d.waveH > 0.5)          return 'no-recomendable';
  if (terralLevel === 3 && d.windKn > 8)        return 'no-recomendable';

  // Exigente
  if (d.windKn > 15)                            return 'exigente';
  if (d.gustKn > 22)                            return 'exigente';
  if (d.waveH > 1.0)                            return 'exigente';
  if (d.wavePer < 4 && d.waveH > 0.3)          return 'exigente';

  // Se puede salir
  if (d.windKn > 10)                            return 'se-puede-salir';
  if (d.gustKn > 16)                            return 'se-puede-salir';
  if (variabilidad > 6)                         return 'se-puede-salir';
  if (d.waveH > 0.6)                            return 'se-puede-salir';
  if (d.wavePer < 5)                            return 'se-puede-salir';
  if (terralLevel === 2)                        return 'se-puede-salir';

  // Piscina — TODAS las condiciones deben cumplirse
  if (
    d.windKn <= 6 &&
    d.gustKn <= 10 &&
    variabilidad < 4 &&
    d.waveH <= 0.3 &&
    d.wavePer >= 7 &&
    terralLevel === 0
  ) return 'piscina';

  // Muy agradable — zona cómoda que no llega a piscina
  return 'muy-agradable';
}

// ── Regla de acumulación ──
// Si hay ≥2 avisos de nivel 3 activos, el estado baja uno.
// Evita que el estado sea incongruente con la experiencia real.
const ORDEN_ESTADOS = ['piscina', 'muy-agradable', 'se-puede-salir', 'exigente', 'no-recomendable'];

function aplicarAcumulacion(estado, warnings) {
  const nivel3s = warnings.filter(w => w.nivel === 3).length;
  if (nivel3s >= 2) {
    const idx = ORDEN_ESTADOS.indexOf(estado);
    return ORDEN_ESTADOS[Math.min(idx + 1, ORDEN_ESTADOS.length - 1)];
  }
  return estado;
}

// ── Pastilla de alerta consolidada (solo para estado no-recomendable) ──
// Cuando el estado es no-recomendable, todos los avisos se fusionan en un
// único párrafo explicativo. El título ya dice todo — esto añade el porqué.
function buildAlertaConsolidada(d, weathercode, warnings) {
  if (weathercode >= 95) {
    return 'Hay tormenta. No es seguro estar en el agua hoy bajo ningún concepto.';
  }
  const terralW = warnings.find(w => w.tipo === 'terral');
  if (terralW?.nivel === 3) {
    return 'El viento de tierra empuja con fuerza hacia mar abierto. El agua puede parecer tranquila desde la orilla — no lo es. Independientemente del resto de condiciones, hoy es mejor quedarse en tierra.';
  }
  if (d.windKn > 20) {
    return `El viento sopla a ${d.windKn.toFixed(0)} nudos. A esa velocidad, remar contra él es imposible — si te alejas, no podrás volver por tu propio pie.`;
  }
  if (d.gustKn > 28) {
    return `Las rachas alcanzan ${d.gustKn.toFixed(0)} nudos. Una racha puede tirarte al agua o alejarte de la orilla antes de que puedas reaccionar.`;
  }
  if (d.waveH > 1.5) {
    return `Las olas superan ${d.waveH.toFixed(1)} metros. El riesgo de caer y no poder volver a la orilla es muy alto.`;
  }
  // Acumulación de condiciones
  return 'La combinación de condiciones de hoy hace que no sea seguro salir. Viento, rachas y mar están al límite al mismo tiempo.';
}

// ── Diagnóstico principal ──
// Punto de entrada único. Devuelve { estado, warnings, alertaConsolidada }.
// alertaConsolidada solo tiene valor cuando estado === 'no-recomendable'.
function diagnosticar(d, spot, weathercode) {
  const terralLevel       = calcularRiesgoTerral(d.windKn, d.gustKn, d.windDir, d.waveH, spot);
  const warnings          = getWarnings(d, terralLevel);
  const estadoBase        = calcEstadoBase(d, weathercode, terralLevel);
  const estado            = aplicarAcumulacion(estadoBase, warnings);
  const alertaConsolidada = estado === 'no-recomendable'
    ? buildAlertaConsolidada(d, weathercode, warnings)
    : null;
  return { estado, warnings, alertaConsolidada };
}

// ── Textos de estado ──
const ESTADOS = {
  'piscina':         { titulo: 'El mar está de piscina',   subtitulo: 'Condiciones ideales. Sal sin dudar.' },
  'muy-agradable':   { titulo: 'Va a estar muy bien',      subtitulo: 'Cómodo y agradable. Un buen día.' },
  'se-puede-salir':  { titulo: 'Hoy se puede salir',       subtitulo: 'Con algo de práctica, sin problema.' },
  'exigente':        { titulo: 'Condiciones exigentes',    subtitulo: 'El agua hoy pone a prueba.' },
  'no-recomendable': { titulo: 'Mejor esperar otro día',   subtitulo: 'Las condiciones no acompañan hoy.' },
};

// ── Bloques narrativos (pantalla principal) ──
// windTitle + windDesc: describe el viento como experiencia
// seaTitle + seaDesc: describe el mar como experiencia
// Los avisos de categoría 'narrativa' (nivel 1) quedan absorbidos en este copy.
function buildBlocks(d, estado) {
  const variabilidad = calcularVariabilidad(d.windKn, d.gustKn);

  let windTitle, windDesc;
  if (d.windKn <= 6 && variabilidad < 4) {
    windTitle = 'El viento está muy suave y constante.';
    windDesc  = 'No lo vas a notar al remar.';
  } else if (d.windKn <= 6 && variabilidad < 7) {
    windTitle = 'Viento suave, pero con algún empujón de vez en cuando.';
    windDesc  = 'Puede pillarte descolocado puntualmente, sin ser un problema.';
  } else if (d.windKn <= 6) {
    windTitle = 'El viento base es suave, pero las rachas son importantes.';
    windDesc  = 'La inestabilidad es lo que más vas a notar hoy.';
  } else if (d.windKn <= 10 && variabilidad < 5) {
    windTitle = 'Hay una brisa ligera y bastante estable.';
    windDesc  = 'Se nota al remar, pero no molesta.';
  } else if (d.windKn <= 10) {
    windTitle = 'Brisa ligera con cambios de intensidad.';
    windDesc  = 'El viento no es fuerte, pero no siempre igual.';
  } else if (d.windKn <= 15 && d.gustKn <= 20) {
    windTitle = 'Viento moderado, sin grandes sorpresas.';
    windDesc  = 'Remar contra él ya cuesta. Exige más esfuerzo.';
  } else if (d.windKn <= 15) {
    windTitle = 'Viento moderado con rachas que empujan fuerte.';
    windDesc  = 'Puede desestabilizarte. Mantén una posición baja.';
  } else if (d.windKn <= 20) {
    windTitle = 'El viento fuerte va a cansarte rápido.';
    windDesc  = 'Las rachas pueden tirarte o alejarte sin que te des cuenta.';
  } else {
    windTitle = 'El viento es demasiado fuerte para salir.';
    windDesc  = 'No es seguro estar en el agua con estas condiciones.';
  }

  let seaTitle, seaDesc;
  if (d.waveH <= 0.3 && d.wavePer >= 7) {
    seaTitle = 'El mar está prácticamente plano y tranquilo.';
    seaDesc  = 'Apenas notarás movimiento. Como remar en una piscina.';
  } else if (d.waveH <= 0.3 && d.wavePer >= 5) {
    seaTitle = 'Mar plano con un ritmo tranquilo.';
    seaDesc  = 'Sin movimiento relevante. Muy cómodo.';
  } else if (d.waveH <= 0.3) {
    seaTitle = 'Mar plano, pero las olas llegan algo irregulares.';
    seaDesc  = 'Puede haber algún movimiento puntual inesperado.';
  } else if (d.waveH <= 0.6 && d.wavePer >= 5) {
    seaTitle = 'Olas muy pequeñas y con un ritmo ordenado.';
    seaDesc  = 'Habrá algo de balanceo, pero predecible y fácil de manejar.';
  } else if (d.waveH <= 0.6) {
    seaTitle = 'Olas pequeñas, pero llegan algo desordenadas.';
    seaDesc  = 'Puede haber algún movimiento inesperado de vez en cuando.';
  } else if (d.waveH <= 1.0 && d.wavePer >= 5) {
    seaTitle = 'Hay movimiento real. Olas medias con ritmo regular.';
    seaDesc  = 'Necesitarás equilibrio. El mar está vivo pero es predecible.';
  } else if (d.waveH <= 1.0) {
    seaTitle = 'Mar movido y algo agitado. Las olas no siguen un ritmo claro.';
    seaDesc  = 'Mantenerse de pie exige concentración. Espera sorpresas.';
  } else if (d.waveH <= 1.5) {
    seaTitle = 'Las olas son grandes y el mar está agitado.';
    seaDesc  = 'Difícil mantenerse estable. Solo para quienes tienen experiencia.';
  } else {
    seaTitle = 'El mar está muy movido. Las olas son demasiado grandes.';
    seaDesc  = 'No es seguro salir en tabla hoy.';
  }

  const cierres = {
    'piscina':         'Un día ideal. Sin esfuerzo, sin sorpresas.',
    'muy-agradable':   'Un buen día para salir. Las condiciones acompañan.',
    'se-puede-salir':  'Puedes salir, pero con más atención de lo habitual.',
    'exigente':        'No es un buen día para la tabla. Mejor esperar en tierra.',
    'no-recomendable': 'Hoy es mejor quedarse en tierra.',
  };

  return { windTitle, windDesc, seaTitle, seaDesc, closing: cierres[estado] };
}

// ── Para quién es ──
// Texto generativo: describe quién puede manejar las condiciones concretas de hoy.
// No describe el perfil en abstracto — describe el día específico.
function getUserFit(estado, warnings) {
  const terralW = warnings.find(w => w.tipo === 'terral');
  const rachasW = warnings.find(w => w.tipo === 'rachas');
  const varW    = warnings.find(w => w.tipo === 'variabilidad');

  switch (estado) {
    case 'piscina':
      return 'Hoy el agua es para cualquiera. Principiante o experto: sin esfuerzo, sin sorpresas.';

    case 'muy-agradable':
      if (terralW) {
        return 'Cómodo para cualquier nivel. Solo ten en cuenta el terral — quédate cerca de la orilla por si acaso.';
      }
      return 'Cómodo para cualquier nivel. Un buen día para estrenar o para salir sin pensar.';

    case 'se-puede-salir':
      if (varW?.nivel === 3 || rachasW?.nivel >= 2) {
        return 'El mar está tranquilo, pero el viento no se porta igual todo el rato. Cómodo para alguien con práctica; un principiante puede sorprenderse con las rachas.';
      }
      if (terralW) {
        return 'Con algo de práctica, sin problema. Ten en cuenta el terral — si el viento cambia, volver puede costar más de lo esperado.';
      }
      return 'Con algo de práctica, sin problema. Un principiante puede salir si va con calma y cerca de la orilla.';

    case 'exigente':
      if (terralW) {
        return 'Solo para remadores con experiencia que saben leer el viento. El terral añade un riesgo que no se ve en la superficie.';
      }
      return 'Hoy no es para principiantes. El viento y el mar juntos exigen técnica y experiencia. Si sabes lo que haces, adelante.';

    case 'no-recomendable':
      return 'Hoy no es para nadie. Las condiciones superan lo que cualquier nivel puede manejar con seguridad.';

    default:
      return '';
  }
}

// ── Info técnica expandible (3 párrafos por métrica) ──
function buildTechBlocks(d, estado) {
  const variabilidad = calcularVariabilidad(d.windKn, d.gustKn);

  let windP1, windP2, windP3;
  if (d.windKn <= 6) {
    windP1 = 'El viento es muy suave. Apenas lo notarás al remar.';
    windP2 = 'El mar se mantiene cómodo y fácil de controlar.';
    windP3 = 'Por debajo de 6 nudos se habla de calma. Condiciones ideales para SUP.';
  } else if (d.windKn <= 10) {
    windP1 = 'El viento sopla con brisa ligera. Se nota al remar, pero no molesta.';
    windP2 = 'Las condiciones son manejables y el esfuerzo, normal.';
    windP3 = 'Entre 7 y 10 nudos es brisa ligera (Beaufort 2–3). Cómodo para paddle surf.';
  } else if (d.windKn <= 15) {
    windP1 = 'El viento es moderado. Remar contra él ya empieza a costar.';
    windP2 = 'Notarás el esfuerzo en la vuelta si el viento está en contra.';
    windP3 = 'Entre 11 y 15 nudos (Beaufort 3–4) el viento empieza a condicionar la salida.';
  } else if (d.windKn <= 20) {
    windP1 = 'El viento es fuerte. Puede cansarte rápido y complicar el control de la tabla.';
    windP2 = 'Si el viento sopla contra ti, volver puede ser muy difícil.';
    windP3 = 'Por encima de 15 nudos (Beaufort 4) las condiciones se complican para SUP recreativo.';
  } else {
    windP1 = 'El viento es demasiado fuerte para estar en el agua.';
    windP2 = 'Una racha puede echarte al agua lejos de la orilla.';
    windP3 = 'Por encima de 20 nudos (Beaufort 5) no es seguro salir en tabla.';
  }

  let gustP1, gustP2, gustP3;
  if (variabilidad < 4) {
    gustP1 = 'Las rachas son muy leves. El viento es estable y constante.';
    gustP2 = 'No habrá sorpresas ni empujones bruscos.';
    gustP3 = 'Poca diferencia entre viento base y rachas: el viento es muy regular.';
  } else if (variabilidad < 7) {
    gustP1 = 'Hay alguna racha puntual. El viento base sigue siendo estable.';
    gustP2 = 'Pueden pillarte descolocado de vez en cuando, sin ser peligroso.';
    gustP3 = 'Diferencia moderada entre base y rachas. Normal en condiciones costeras.';
  } else if (variabilidad < 11) {
    gustP1 = 'Las rachas son importantes aunque el viento base parezca tranquilo.';
    gustP2 = 'Pueden desestabilizarte. Mantén una posición baja en la tabla.';
    gustP3 = 'Diferencia alta entre base y rachas. Hay que estar muy atento.';
  } else {
    gustP1 = 'Las rachas son peligrosas incluso si el viento base parece tranquilo.';
    gustP2 = 'Una racha puede empujarte hacia mar abierto o echarte al agua.';
    gustP3 = 'Diferencia muy alta entre base y rachas. No es seguro sin mucha experiencia.';
  }

  let seaP1, seaP2, seaP3;
  if (d.waveH <= 0.3) {
    seaP1 = 'Las olas son muy pequeñas. El mar está casi plano.';
    seaP2 = 'El equilibrio es fácil y el esfuerzo para mantenerte de pie es mínimo.';
    seaP3 = 'Por debajo de 0.3 m el mar se considera plano. Condiciones ideales.';
  } else if (d.waveH <= 0.6) {
    seaP1 = 'Las olas son pequeñas. Habrá algo de balanceo, pero controlable.';
    seaP2 = 'Con estas olas el equilibrio no es difícil para alguien con algo de práctica.';
    seaP3 = 'Entre 0.3 y 0.6 m hay movimiento, pero no es preocupante.';
  } else if (d.waveH <= 1.0) {
    seaP1 = 'Las olas son medianas. El mar tiene movimiento real.';
    seaP2 = 'Mantener el equilibrio requiere concentración y algo de técnica.';
    seaP3 = 'Por encima de 0.6 m las condiciones ya se notan. Para quienes tienen práctica.';
  } else if (d.waveH <= 1.5) {
    seaP1 = 'Las olas son grandes. El mar está agitado.';
    seaP2 = 'Mantenerse de pie es difícil. Solo apto para remadores con experiencia.';
    seaP3 = 'Por encima de 1 m no se recomienda para paddle surf recreativo.';
  } else {
    seaP1 = 'Las olas son peligrosas para hacer paddle surf.';
    seaP2 = 'El riesgo de caer y alejarse de la orilla es muy alto.';
    seaP3 = 'Por encima de 1.5 m el mar no es apto para actividades recreativas.';
  }

  let perP1, perP2, perP3;
  if (d.wavePer >= 7) {
    perP1 = 'Las olas tienen un ritmo largo y ordenado.';
    perP2 = 'Un período largo hace las olas predecibles y fáciles de leer.';
    perP3 = 'Por encima de 7 s se considera oleaje organizado. Fácil de manejar.';
  } else if (d.wavePer >= 5) {
    perP1 = 'El mar tiene un ritmo normal. Las olas son manejables.';
    perP2 = 'Ni demasiado caótico ni demasiado organizado.';
    perP3 = 'Entre 5 y 7 s es un período normal. El mar se mantiene predecible.';
  } else if (d.wavePer >= 4) {
    perP1 = 'Las olas tienen un ritmo algo irregular.';
    perP2 = 'El mar puede sorprenderte de vez en cuando.';
    perP3 = 'Por debajo de 5 s las olas son más cortas e impredecibles.';
  } else {
    perP1 = 'El mar está nervioso y con olas muy cortas.';
    perP2 = 'Este tipo de oleaje hace difícil mantener el equilibrio.';
    perP3 = 'Por debajo de 4 s el mar está muy revuelto. Condiciones complicadas.';
  }

  const cierres = {
    'piscina':         'En conjunto, condiciones ideales. No hay mejor día para salir.',
    'muy-agradable':   'En conjunto, las condiciones acompañan. Disfruta.',
    'se-puede-salir':  'En conjunto, manejable. Con atención y algo de práctica.',
    'exigente':        'En conjunto, el agua hoy exige. Solo si tienes experiencia.',
    'no-recomendable': 'En conjunto, hoy no es el día. Mejor esperar.',
  };

  return {
    wind:    { p1: windP1, p2: windP2, p3: windP3 },
    gusts:   { p1: gustP1, p2: gustP2, p3: gustP3 },
    sea:     { p1: seaP1,  p2: seaP2,  p3: seaP3  },
    period:  { p1: perP1,  p2: perP2,  p3: perP3  },
    closing: cierres[estado],
  };
}

// ── Resumen corto (2-3 frases, pantalla principal) ──
function buildSummary(d, estado) {
  const variabilidad = calcularVariabilidad(d.windKn, d.gustKn);

  let wind;
  if      (d.windKn <= 6  && variabilidad < 4)  wind = 'Viento muy suave y constante.';
  else if (d.windKn <= 6  && variabilidad < 7)  wind = 'Viento suave, con alguna racha.';
  else if (d.windKn <= 6)                        wind = 'Viento suave pero rachas notables.';
  else if (d.windKn <= 10 && variabilidad < 5)   wind = 'Brisa ligera, bastante estable.';
  else if (d.windKn <= 10)                       wind = 'Brisa ligera con rachas.';
  else if (d.windKn <= 15)                       wind = 'Viento moderado. Remar cuesta.';
  else if (d.windKn <= 20)                       wind = 'Viento fuerte.';
  else                                            wind = 'Viento muy fuerte.';

  let sea;
  if      (d.waveH <= 0.3 && d.wavePer >= 7)  sea = 'Mar plano y tranquilo.';
  else if (d.waveH <= 0.3 && d.wavePer >= 5)  sea = 'Mar plano con ritmo normal.';
  else if (d.waveH <= 0.3)                     sea = 'Mar plano pero algo nervioso.';
  else if (d.waveH <= 0.6 && d.wavePer >= 5)  sea = 'Olas muy pequeñas y ordenadas.';
  else if (d.waveH <= 0.6)                     sea = 'Olas pequeñas, algo irregulares.';
  else if (d.waveH <= 1.0 && d.wavePer >= 5)  sea = 'Olas medias, mar movido.';
  else if (d.waveH <= 1.0)                     sea = 'Mar movido y algo agitado.';
  else if (d.waveH <= 1.5)                     sea = 'Olas grandes. Equilibrio difícil.';
  else                                          sea = 'Mar muy movido.';

  const cierres = {
    'piscina':         'Condiciones ideales para salir.',
    'muy-agradable':   'Condiciones cómodas en general.',
    'se-puede-salir':  'Puedes salir, pero con atención.',
    'exigente':        'Condiciones exigentes hoy.',
    'no-recomendable': 'Mejor no meterse hoy.',
  };

  return `${wind} ${sea} ${cierres[estado]}`;
}

// ── Etiquetas métricas ──
function labelViento(kn) {
  if (kn <= 6)  return { label: 'Calma total',     phrase: 'No lo notarás ni en el pelo.' };
  if (kn <= 10) return { label: 'Brisa ligera',    phrase: 'Se nota pero no molesta.' };
  if (kn <= 15) return { label: 'Viento moderado', phrase: 'Remar contra él ya cuesta.' };
  if (kn <= 20) return { label: 'Viento fuerte',   phrase: 'El mar está revuelto.' };
  return        { label: 'Demasiado viento',        phrase: 'No es seguro estar en el agua.' };
}

function labelOla(m) {
  if (m <= 0.3) return { label: 'Plana',      phrase: 'Como una piscina. Sin movimiento.' };
  if (m <= 0.6) return { label: 'Pequeña',    phrase: 'Algo de balanceo. Agradable.' };
  if (m <= 1.0) return { label: 'Mediana',    phrase: 'Te mueve. Necesitas equilibrio.' };
  if (m <= 1.5) return { label: 'Grande',     phrase: 'Difícil mantenerse de pie.' };
  return        { label: 'Muy grande',         phrase: 'Peligroso para SUP recreativo.' };
}

function labelRacha(kn) {
  if (kn <= 8)  return { label: 'Estable',         phrase: 'Sin sorpresas. El viento es constante.' };
  if (kn <= 12) return { label: 'Alguna racha',     phrase: 'Pequeños empujones puntuales.' };
  if (kn <= 16) return { label: 'Rachas fuertes',   phrase: 'Pueden pillarte descolocado.' };
  return        { label: 'Rachas peligrosas',        phrase: 'Una racha puede echarte al agua lejos de la orilla.' };
}

function labelPeriodo(s) {
  if (s < 4)  return { label: 'Ola caótica',    phrase: 'Corta y desordenada. El mar está nervioso.' };
  if (s < 7)  return { label: 'Ola normal',     phrase: 'Ritmo normal. Manejable.' };
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
  if (degrees >= 225 && degrees <= 315) {
    return { label: `${card} · Viento terral`, phrase: 'Parece tranquilo pero te aleja del mar. ¡Cuidado!' };
  }
  if (degrees >= 45 && degrees <= 135) {
    return { label: `${card} · Viento de mar`, phrase: 'Empuja hacia la orilla. Sin riesgo de alejarte.' };
  }
  return { label: `${card} · Lateral`, phrase: 'El más neutro. Solo vigila la deriva.' };
}
