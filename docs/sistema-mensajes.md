# Cocodrift — Sistema de mensajes
_Documento vivo. Última actualización: abril 2026. Versión: v2.0_

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
| se-puede-salir | SÍ, ESTÁ MOVIDO PERO MANEJABLE |
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
| waveH < 0.3m | El mar está como una piscina | Sin olas y sin apenas movimiento. Todo se siente estable. |
| waveH 0.3–0.6m | Algo de movimiento, pero suave | Pequeñas olas y ritmo regular. Nada que sorprenda. |
| waveH 0.6–1.0m | El mar tiene movimiento real | Olas medias y viento que cambia por momentos. |
| waveH > 1.0m ó (waveH > 0.6m y wavePer < 4s) | Mar movido y poco ordenado | Olas que no siguen un ritmo claro y viento incómodo. |
| waveH > 1.5m | El mar está muy revuelto | Olas grandes, cortas y desordenadas. Todo se mueve a la vez. |

Nota: el umbral de waveH > 1.5m tiene prioridad sobre el de > 1.0m.

---

### Bloque 2 — Demand ("Qué te va a pedir")

Input: `windKn` (nudos)

| Condición | title | desc |
|---|---|---|
| windKn < 5 | Remar está fácil y fluido | No hay resistencia ni esfuerzo extra. Puedes avanzar sin cansarte. |
| windKn 5–10 | Se rema cómodo, algo de viento | Lo notas, pero no molesta ni condiciona. |
| windKn 10–15 | Necesitarás mantener el equilibrio | Las rachas pueden descolocarte y remar ya exige esfuerzo. |
| windKn 15–20 | Mantenerse de pie exige técnica | El viento empuja y el mar no ayuda. No puedes relajarte. |
| windKn > 20 | Remar se vuelve muy difícil | El viento te frena o te arrastra, y mantener el equilibrio cuesta mucho. |

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
- Encounter: "El mar está como una piscina" / "Sin olas y sin apenas movimiento. Todo se siente estable."
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
- Demand: "Mantenerse de pie exige técnica" / "El viento empuja y el mar no ayuda. No puedes relajarte."
- Fit: "Solo para gente con experiencia" / "Si no tienes control, lo vas a pasar mal."

### No recomendable — viento 22kn, ola 1.6m, periodo 3s
- Encounter: "El mar está muy revuelto" / "Olas grandes, cortas y desordenadas. Todo se mueve a la vez."
- Demand: "Remar se vuelve muy difícil" / "El viento te frena o te arrastra, y mantener el equilibrio cuesta mucho."
- Fit: "No es un día para salir" / "Las condiciones no son seguras, independientemente del nivel."

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
