# Cocodrift — Sistema de mensajes v2.0
_Snapshot archivado: abril 2026. No modificar — es referencia histórica._

---

## 1. Principio

El estado responde: **¿Salgo o no?**
Los bloques explican: **Qué está pasando hoy exactamente.**

Los textos no describen datos. Describen experiencia.
Lenguaje directo, físico. Sin tecnicismos, sin abstracciones.

---

## 2. Franjas horarias

5 franjas. Cada una es una media de las horas que cubre.

| Índice | ID | Label | Horas |
|---|---|---|---|
| 0 | madrugada | Madrugada | 00–06 |
| 1 | amanecer | Amanecer | 07–09 |
| 2 | mediodia | Mediodía | 10–13 |
| 3 | tarde | Tarde | 14–18 |
| 4 | noche | Noche | 19–23 |

---

## 3. Estados

5 estados posibles. El estado lo calcula `diagnosticar()` en `score.js`.

| Estado | Título visible (presubtítulo: ¿Está para salir?) |
|---|---|
| piscina | OH YEAH, SIN DUDARLO |
| muy-agradable | SÍ, ESTÁ MUY AGRADABLE |
| se-puede-salir | ESTÁ MOVIDO PERO MANEJABLE |
| exigente | DEPENDE, ESTÁ EXIGENTE |
| no-recomendable | MEJOR QUEDARSE EN TIERRA |

---

## 4. Bloques narrativos (3)

Se generan con `buildNarrativeBlocks(d, estado, warnings)`.
Devuelve `{ encounter, demand, fit }` — cada uno con `{ title, desc }`.

El usuario no ve las etiquetas de los bloques, solo el contenido.

---

### Bloque 1 — Encounter ("Qué te vas a encontrar")

Input: `waveH` (metros) + `wavePer` (segundos)

| Condición | title | desc |
|---|---|---|
| waveH ≤ 0.3m, wavePer ≥ 7s | El mar está como una piscina | Sin olas y sin apenas movimiento. Se siente estable. |
| waveH ≤ 0.3m, wavePer < 7s | El mar está casi plano | Olas pequeñas en la orilla pueden descolocar al empezar, pero fuera se siente estable. |
| waveH 0.3–0.6m, wavePer ≥ 4s | Algo de movimiento, pero suave | Pequeñas olas con ritmo constante. Nada preocupante. |
| waveH 0.3–0.6m, wavePer < 4s | Olas pequeñas pero constantes | Que te mantienen todo el rato en movimiento. |
| waveH 0.6–1.5m | El mar está movido | Las olas se notan y no tienen un ritmo claro. |
| waveH > 1.0m ó (waveH > 0.6m y wavePer < 4s) | Mar movido y poco ordenado | Olas que no siguen un ritmo claro y viento incómodo. |
| waveH > 1.5m | El mar está muy revuelto | Olas grandes, cortas y desordenadas. |

Nota: las condiciones se evalúan de mayor a menor gravedad (1.5m → 1.0m/cortas → 0.6m → 0.3m+cortas → 0.3m + wavePer<7 → piscina wavePer≥7).
El umbral wavePer=7 es el mismo que usa `calcEstadoBase` para el estado `piscina` — intencional.

---

### Bloque 2 — Demand ("Qué te va a pedir")

Input: `windKn` (nudos)

| Condición | title | desc |
|---|---|---|
| windKn < 5 | Remar está fácil y fluido | No hay resistencia ni esfuerzo extra. Se avanza tranquilamente. |
| windKn 5–10 | Se rema cómodo, algo de viento | Lo notas, pero no molesta ni condiciona. |
| windKn 10–15 | Necesitarás mantener el equilibrio | Las rachas pueden descolocarte y remar ya exige esfuerzo. |
| windKn 15–20 | Mantenerse de pie exige técnica | El viento empuja y el mar no ayuda. No se está mood relax. |
| windKn > 20 | Remar se vuelve muy difícil | El viento puede frenarte o arrastrarte. Mantener el equilibrio cuesta mucho. |

---

### Bloque 3 — Fit ("Para quién encaja")

Input: `estado` + `warnings` activos (categoría alerta o cuidado)

| Condición | title | desc |
|---|---|---|
| estado: piscina | Es un día para cualquiera | Da igual el nivel. Es perfecto incluso si es tu primera vez. |
| estado: muy-agradable | Apto para casi todos | Si has salido alguna vez, lo vas a disfrutar sin problema. |
| estado: se-puede-salir + sin warnings críticos | Mejor con algo de experiencia | Si ya controlas la tabla, es buen día. Si no, puede costar. |
| estado: se-puede-salir + warnings activos, ó exigente | Solo para gente con experiencia | Si no tienes control, lo vas a pasar mal. |
| estado: no-recomendable | No es un día para salir | Las condiciones no son seguras, independientemente del nivel. |

Warnings críticos = categoría `alerta` o `cuidado` en el array de warnings.

---

## 5. Ejemplos completos

### Piscina — viento 4kn, ola 0.2m, periodo 8s
- Encounter: "El mar está como una piscina" / "Sin olas y sin apenas movimiento. Se siente estable."
- Demand: "Remar está fácil y fluido" / "No hay resistencia ni esfuerzo extra. Puedes avanzar sin cansarte."
- Fit: "Es un día para cualquiera" / "Da igual el nivel. Es perfecto incluso si es tu primera vez."

### Muy agradable — viento 8kn, ola 0.4m
- Encounter: "Algo de movimiento, pero suave" / "Pequeñas olas y ritmo regular. Nada que sorprenda."
- Demand: "Se rema cómodo, algo de viento" / "Lo notas, pero no molesta ni condiciona."
- Fit: "Apto para casi todos" / "Si has salido alguna vez, lo vas a disfrutar sin problema."

### Se puede salir — viento 11kn, rachas 18kn, ola 0.7m
- Encounter: "El mar tiene movimiento real" / "Olas medias y viento que cambia por momentos."
- Demand: "Necesitarás mantener el equilibrio" / "Las rachas pueden descolocarte y remar ya exige esfuerzo."
- Fit: "Mejor con algo de experiencia" / "Si ya controlas la tabla, es buen día. Si no, puede costar."

### Exigente — viento 16kn, ola 1.1m, periodo 4s
- Encounter: "Mar movido y poco ordenado" / "Olas que no siguen un ritmo claro y viento incómodo."
- Demand: "Mantenerse de pie exige técnica" / "El viento empuja y el mar no ayuda. No se está mood relax."
- Fit: "Solo para gente con experiencia" / "Si no tienes control, lo vas a pasar mal."

### No recomendable — viento 22kn, ola 1.6m, periodo 3s
- Encounter: "El mar está muy revuelto" / "Olas grandes, cortas y desordenadas."
- Demand: "Remar se vuelve muy difícil" / "El viento puede frenarte o arrastrarte. Mantener el equilibrio cuesta mucho."
- Fit: "No es un día para salir" / "Las condiciones no son seguras, independientemente del nivel."

---

## 7. Overrides de Demand

Cuando el factor dominante no es el viento base, se aplican overrides en este orden:

| Condición | title | desc |
|---|---|---|
| wavePer < 4s && waveH > 0.3m && windKn ≤ 5 | Remar no cuesta, pero no vas a estar estable | Aunque el viento sea suave, el mar te moverá constantemente. |
| waveH > 0.6m && windKn ≤ 5 | Remar no cuesta, pero no vas a estar estable | Las olas te moverán constantemente y exigen equilibrio. |
| variabilidad > 6 && windKn ≤ 5 && waveH ≤ 0.6m | El viento engaña | Hay ratos de calma y otros en los que empuja de golpe. |
| terral ≥ 2 && windKn ≤ 5 && waveH ≤ 0.6m | Remar es fácil, pero el viento te aleja de la orilla | Viene de tierra y te empuja hacia el mar. Si se pone más fuerte, volver costará más. |
| terral = 1 && windKn ≤ 5 && waveH ≤ 0.6m | Leve viento que viene de tierra | Y te empuja levemente hacia el mar. 0 drama si no te alejas demasiado. |

Los overrides se aplican en ese orden — el último en pasar sobreescribe el anterior.

---

## 6. Implementación

Función: `buildNarrativeBlocks(d, estado, warnings)` en `score.js`

Inputs:
- `d.waveH` — altura de ola en metros
- `d.wavePer` — periodo en segundos
- `d.windKn` — viento medio en nudos
- `estado` — string del estado calculado
- `warnings` — array de objetos `{ categoria, label, copy }`

Output:
```js
{
  encounter: { title, desc },
  demand:    { title, desc },
  fit:       { title, desc }
}
```

Integración: `renderResults()` en `app.js`. Reemplaza el sistema actual de `buildBlocks()`.
