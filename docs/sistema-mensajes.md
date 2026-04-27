# Cocodrift — Sistema de mensajes
_Documento vivo. Última actualización: abril 2026. Versión: v2.1_

---

## 1. Principio

El estado responde: **¿Salgo o no?**
Los bloques explican: **Qué está pasando hoy exactamente.**

Los textos no describen datos. Describen experiencia.
Lenguaje directo, físico. Sin tecnicismos, sin abstracciones.

**Límite de longitud:** máximo 70 chars por desc de bloque (2 líneas en bocadillo).
Excepción justificada: terral ≥ 2 puede llegar a 3 líneas.

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
Los títulos van en mayúsculas en la UI.

| Estado | Título visible |
|---|---|
| piscina | SE ESTÁ COMO EN UNA PISCINA |
| muy-agradable | ESTÁ SUPER AGRADABLE |
| se-puede-salir | ESTÁ MOVIDITO PERO MANEJABLE |
| exigente | EL MAR ESTÁ EXIGENTE |
| no-recomendable | HOY MEJOR EN TIERRA |

---

## 4. Bloques narrativos (3)

Se generan con `buildNarrativeBlocks(d, estado, warnings)`.
Devuelve `{ encounter, demand, fit }` — cada uno con `{ title, desc }`.

**Diseño 1 — bocadillo:** muestra `encounter.desc` + `demand.desc` + `fit.title`
**Diseño 2 — cards:** muestra `block.title` (negrita) + `block.desc`

Presupuesto de líneas en el bocadillo (~35 chars/línea):
- `encounter.desc`: 2 líneas máx (70 chars)
- `demand.desc`: 2 líneas máx (70 chars)
- `fit.title`: 1 línea (35 chars)
- Total: 5 líneas

---

### Bloque 1 — Encounter ("Qué te vas a encontrar")

Input: `waveH` (metros) + `wavePer` (segundos)

Las condiciones se evalúan de mayor a menor gravedad.

| Condición | title | desc |
|---|---|---|
| waveH ≤ 0.3m, wavePer ≥ 7s | El mar está parado | Sin olas ni movimiento. Plano de verdad. |
| waveH ≤ 0.3m, wavePer < 7s | El mar está casi plano | Casi plano, pero hay movimiento en la orilla. Puede costar entrar. |
| waveH 0.3–0.6m, wavePer ≥ 4s | Algo de movimiento, pero suave | Olas pequeñas con ritmo regular. Nada que sorprenda. |
| waveH 0.3–0.6m, wavePer < 4s | Olas pequeñas pero constantes | Hay movimiento todo el rato. No para, pero tampoco es grave. |
| waveH 0.6–1.5m | El mar está movido | Las olas se notan. No siguen un ritmo claro. |
| waveH > 1.0m ó (waveH > 0.6m y wavePer < 4s) | El mar está movido y poco ordenado | Olas sin ritmo que no dan tregua. Hay que estar muy atento. |
| waveH > 1.5m | El mar está muy revuelto | Olas grandes, cortas y sin orden. |

---

### Bloque 2 — Demand ("Qué te va a pedir")

Input: `windKn` (nudos)

| Condición | title | desc |
|---|---|---|
| windKn < 5 | Remar está fácil | Sin resistencia. Se avanza tranquilamente. |
| windKn 5–10 | Viento suave, rema cómodo | Hay algo de viento, pero no molesta ni condiciona. |
| windKn 10–15 | El viento ya condiciona | El viento no es constante y puede pillarte. Remar empieza a costar. |
| windKn 15–20 | El viento empuja fuerte | El viento empuja fuerte. Mantener el equilibrio exige concentración. |
| windKn > 20 | El viento puede arrastrarte | El viento puede arrastrarte. Muy difícil mantenerse. |

---

### Bloque 2 — Overrides de Demand

Cuando el factor dominante no es el viento base, se aplican overrides en este orden.
El último en pasar sobreescribe el anterior.

| Condición | title | desc |
|---|---|---|
| wavePer < 4s && waveH > 0.3m && windKn ≤ 5 | El mar no para quieto | El viento es suave, pero el mar te moverá todo el rato. |
| waveH > 0.6m && windKn ≤ 5 | Las olas mandan | El viento no molesta, pero las olas te moverán sin parar. |
| variabilidad > 6 && windKn ≤ 5 && waveH ≤ 0.6m | El viento engaña | El viento engaña: calma y de repente empuja fuerte. |
| terral ≥ 2 && windKn ≤ 5 && waveH ≤ 0.6m | El viento te aleja de la orilla | Viento de tierra: te empuja hacia el mar. Si sube, volver costará. |
| terral = 1 && windKn ≤ 5 && waveH ≤ 0.6m | Leve terral, sin drama | Leve viento de tierra. Te empuja un poco. Sin drama. |

---

### Bloque 3 — Fit ("Para quién encaja")

Input: `estado` + `warnings` activos (categoría alerta o cuidado)

`fit.title` es el texto del bocadillo (1 línea, ~35 chars).
`fit.desc` es el texto de soporte en las cards.

| Condición | title | desc |
|---|---|---|
| estado: piscina | Fácil incluso si es tu primera vez. | Da igual el nivel. Es perfecto incluso si es tu primera vez. |
| estado: muy-agradable | Apto para casi todos. | Si has salido alguna vez, lo vas a disfrutar sin problema. |
| estado: se-puede-salir + sin warnings críticos | Mejor si ya has salido alguna vez. | Si ya controlas la tabla, es buen día. Si no, puede costar. |
| estado: se-puede-salir + warnings activos, ó exigente | Solo para gente con experiencia. | Sin control real, lo vas a pasar mal. |
| estado: no-recomendable | No es seguro para nadie hoy. | Las condiciones no son seguras, independientemente del nivel. |

Warnings críticos = categoría `alerta` o `cuidado` en el array de warnings.

---

## 5. Ejemplos completos

### Piscina — viento 4kn, ola 0.2m, periodo 8s
- Encounter: "El mar está parado" / "Sin olas ni movimiento. Plano de verdad."
- Demand: "Remar está fácil" / "Sin resistencia. Se avanza tranquilamente."
- Fit: "Fácil incluso si es tu primera vez." / "Da igual el nivel. Es perfecto incluso si es tu primera vez."

**Bocadillo:** "Sin olas ni movimiento. Plano de verdad. / Sin resistencia. Se avanza tranquilamente. / Fácil incluso si es tu primera vez."

### Muy agradable — viento 8kn, ola 0.4m, periodo 5s
- Encounter: "Algo de movimiento, pero suave" / "Olas pequeñas con ritmo regular. Nada que sorprenda."
- Demand: "Viento suave, rema cómodo" / "Hay algo de viento, pero no molesta ni condiciona."
- Fit: "Apto para casi todos." / "Si has salido alguna vez, lo vas a disfrutar sin problema."

**Bocadillo:** "Olas pequeñas con ritmo regular. Nada que sorprenda. / Hay algo de viento, pero no molesta ni condiciona. / Apto para casi todos."

### Se puede salir — viento 11kn, rachas 18kn, ola 0.7m
- Encounter: "El mar está movido" / "Las olas se notan. No siguen un ritmo claro."
- Demand: "El viento ya condiciona" / "El viento no es constante y puede pillarte. Remar empieza a costar."
- Fit: "Mejor si ya has salido alguna vez." / "Si ya controlas la tabla, es buen día. Si no, puede costar."

**Bocadillo:** "Las olas se notan. No siguen un ritmo claro. / El viento no es constante y puede pillarte. Remar empieza a costar. / Mejor si ya has salido alguna vez."

### Exigente — viento 16kn, ola 1.1m, periodo 4s
- Encounter: "El mar está movido y poco ordenado" / "Olas sin ritmo que no dan tregua. Hay que estar muy atento."
- Demand: "El viento empuja fuerte" / "El viento empuja fuerte. Mantener el equilibrio exige concentración."
- Fit: "Solo para gente con experiencia." / "Sin control real, lo vas a pasar mal."

**Bocadillo:** "Olas sin ritmo que no dan tregua. Hay que estar muy atento. / El viento empuja fuerte. Mantener el equilibrio exige concentración. / Solo para gente con experiencia."

### No recomendable — viento 22kn, ola 1.6m, periodo 3s
- Encounter: "El mar está muy revuelto" / "Olas grandes, cortas y sin orden."
- Demand: "El viento puede arrastrarte" / "El viento puede arrastrarte. Muy difícil mantenerse."
- Fit: "No es seguro para nadie hoy." / "Las condiciones no son seguras, independientemente del nivel."

**Bocadillo:** "Olas grandes, cortas y sin orden. / El viento puede arrastrarte. Muy difícil mantenerse. / No es seguro para nadie hoy."

### Terral moderado — viento 4kn, terral ≥ 2, ola 0.2m, periodo 5s
- Encounter: "El mar está casi plano" / "Casi plano, pero hay movimiento en la orilla. Puede costar entrar."
- Demand (override): "El viento te aleja de la orilla" / "Viento de tierra: te empuja hacia el mar. Si sube, volver costará."
- Fit: "Mejor si ya has salido alguna vez." / "Si ya controlas la tabla, es buen día. Si no, puede costar."

**Bocadillo:** "Casi plano, pero hay movimiento en la orilla. Puede costar entrar. / Viento de tierra: te empuja hacia el mar. Si sube, volver costará. / Mejor si ya has salido alguna vez."

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

Integración: `renderResults()` en `app.js`.
