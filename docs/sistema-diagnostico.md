# Cocodrift — Sistema de diagnóstico y UX
_Documento vivo. Última actualización: abril 2026._

---

## 1. Visión de producto

Cocodrift es una app de **decisión**, no de datos.

Responde a una pregunta: **¿Salgo al agua hoy?**

No requiere conocimiento técnico. No muestra datos para interpretar.
Traduce condiciones del mar en una experiencia clara.

El usuario entiende en segundos:
- qué se va a encontrar
- si encaja con él

**Principio clave:** el usuario no decide con una etiqueta, decide con una historia corta.

---

## 2. Modelo mental: mood del mar

El sistema no evalúa si el mar es "bueno" o "malo".
Evalúa **qué experiencia vas a tener en el agua**.

Esto se expresa como **mood del mar**. El mood no es suficiente por sí solo — se complementa con narrativa y avisos.

---

## 3. Principios físicos

### Viento
- ≤ 6 kn → condiciones ideales
- ≤ 10 kn → cómodo
- 10–15 kn → empieza a ser exigente
- > 15 kn → difícil para la mayoría
- Principiantes: máximo recomendado ≈ 7 kn en mar abierto (hasta 10 kn con instructor o en agua cerrada)
- _Fuente: ASI, Paddle UK/BCAB — documentos oficiales abril 2025_

### Rachas
Desestabilizan, rompen el equilibrio, generan imprevisibilidad.
La variabilidad es tan importante como el valor medio.

### Variabilidad (variable propia de Cocodrift)
`variabilidad = racha - viento`

No existe como variable formalizada en literatura técnica de SUP. Aparece implícitamente en práctica de instructores ("si la racha supera el viento en más de 5 kn, trata las condiciones un nivel por encima"). Cocodrift la formaliza con umbrales explícitos.

- < 3 kn → estable
- 3–6 kn → ligera variación
- 6–10 kn → incómodo
- > 10 kn → inestable real

**Insight clave:** la estabilidad pesa más que la media.

### Dirección — Terral (offshore)
El terral puede arrastrarte mar adentro independientemente del resto de condiciones.
**Siempre se trata como aviso independiente.**

Datos RNLI: 48% de rescates a SUP en UK son por terral. En el suroeste, el 90%.
Force 4 de terral puede arrastrar >1 milla en 30 minutos.

### Ola y período
Ola pequeña ≠ siempre cómoda.

Período:
- ≥ 7 s → fluido (óptimo real ≥ 10 s)
- 5–7 s → normal
- 4–5 s → incómodo
- < 4 s → caótico

Ola + período define la "textura" del mar.
_Fuentes: Barrachou SUP, Islandeering, BCAB_

---

## 4. Variables del sistema

**Variables base** (entrada de Open-Meteo):
- `windKn` — viento en nudos
- `gustKn` — rachas en nudos
- `windDir` — dirección en grados
- `waveH` — altura de ola en metros
- `wavePer` — período en segundos
- `weathercode` — código WMO (tormenta si ≥ 95)

**Variables derivadas** (calculadas):
- `variabilidad = gustKn - windKn`
- `terralLevel` — nivel 0–3 según dirección + viento + spot

**Eliminadas del cálculo:**
- Nubes — no afectan la experiencia en el agua

---

## 5. Perfiles de usuario

No se seleccionan. Se reflejan en el bloque "Para quién es" con texto específico para las condiciones del momento.

| Perfil | Viento | Características |
|---|---|---|
| Principiante | < 7 kn (mar abierto) | mar plano, sin rachas, sin terral |
| Intermedio | 7–15 kn | algo de movimiento, rachas moderadas |
| Avanzado | 15–20 kn | mar movido, rachas fuertes |
| Experto | > 20 kn | condiciones duras |

El texto no describe el perfil en abstracto — describe las condiciones concretas del día y quién puede manejarlo.

---

## 6. Sistema de estados (moods)

### 6.1 Los 5 estados

| Estado | Mood | Descripción |
|---|---|---|
| 1 | Piscina | Condiciones ideales, sin exigencia |
| 2 | Muy agradable | Cómodo, con posibles ligeras variaciones |
| 3 | Se puede salir | Requiere manejo activo, manejable |
| 4 | Exigente | Requiere habilidad, el agua castiga errores |
| 5 | No recomendable | Condiciones que superan lo aceptable |

### 6.2 Reglas de estado

**Estado 1 — Piscina**
Requiere TODAS las condiciones:
- viento ≤ 6 kn
- rachas ≤ 10 kn
- variabilidad < 4 kn
- ola ≤ 0.3 m
- período ≥ 7 s _(ajustado por fuentes técnicas: <5s ya es muy incómodo)_
- terral: nivel 0 (sin terral)

**Estado 2 — Muy agradable**
- viento ≤ 10 kn
- rachas ≤ 16 kn
- variabilidad ≤ 6 kn
- ola ≤ 0.6 m
- período ≥ 5 s
- terral: máximo nivel 1 (leve)

**Estado 3 — Se puede salir**
- viento 10–15 kn
- rachas ≤ 22 kn
- variabilidad ≤ 10 kn
- ola ≤ 1.0 m
- período ≥ 4 s
- terral: máximo nivel 1 (nivel 2 sube a se-puede-salir)

**Estado 4 — Exigente**
- viento 15–20 kn
- rachas ≤ 28 kn
- variabilidad: sin límite (ya hay aviso activo)
- ola ≤ 1.5 m
- período ≥ 3 s

**Estado 5 — No recomendable**
Se activa si cualquiera de:
- viento > 20 kn
- rachas > 28 kn
- ola > 1.5 m
- período < 3 s + ola > 0.5 m
- tormenta (weathercode ≥ 95)
- terral nivel 3 + viento > 8 kn
- ≥ 2 avisos de nivel 3 simultáneos (regla de acumulación)

### 6.3 Regla de acumulación

Si hay ≥ 2 avisos de nivel 3 activos simultáneamente → el estado baja uno automáticamente.

Evita que el estado sea incongruente con la experiencia real (ej: "exigente" cuando la combinación hace el agua realmente peligrosa).

### 6.4 Sesgo conservador en bordes

Cuando una variable está en el límite entre dos estados, redondear siempre hacia el estado más restrictivo. El coste de ser más restrictivo es bajo; el inverso, alto.

---

## 7. Separación clave: estado ≠ riesgo

**Estado:** describe la experiencia general.
**Avisos:** describen lo que puede complicarla.

Son capas independientes. Un estado puede ser "Muy agradable" con un aviso activo. El aviso no cambia el estado — lo matiza.

---

## 8. Sistema de avisos

### 8.1 Principio

Los avisos no describen el fenómeno — describen **la experiencia**.
No alarman innecesariamente. Siempre explican qué pasa y qué implica.

### 8.2 Tres niveles de gravedad

| Nivel | Nombre | Dónde aparece | Tono |
|---|---|---|---|
| 1 | **A tener en cuenta** | Bloque discreto, fondo neutro | Informativo |
| 2 | **Cuidado** | Bloque medio, fondo diferenciado | Atención |
| 3 | **Alerta** | Bloque prominente, fondo destacado | Claro, directo |

Los avisos de categoría **narrativa** (nivel más bajo de rachas, variabilidad y mar) se absorben directamente en el copy del bloque de decisión — no generan bloque propio.

### 8.3 Tabla tipo/nivel → categoría

| Tipo | Nivel 1 | Nivel 2 | Nivel 3 |
|---|---|---|---|
| **Rachas** | narrativa | A tener en cuenta | Alerta |
| **Variabilidad** | narrativa | A tener en cuenta | Cuidado |
| **Mar incómodo** | narrativa | A tener en cuenta | Cuidado |
| **Terral** | A tener en cuenta | Cuidado | Alerta |

El terral siempre genera bloque visible (nunca narrativa) porque el mecanismo de riesgo existe desde el nivel 1.
El mar incómodo nunca llega a Alerta — es incomodidad, no riesgo de seguridad.

### 8.4 Triggers numéricos

**Rachas:**
- Nivel 1: gustKn 12–16 (narrativa)
- Nivel 2: gustKn 16–22 (A tener en cuenta)
- Nivel 3: gustKn > 22 (Alerta)

**Variabilidad (racha − viento):**
- Nivel 1: 4–6 kn (narrativa)
- Nivel 2: 6–10 kn (A tener en cuenta)
- Nivel 3: > 10 kn (Cuidado)

**Mar incómodo (período + ola):**
- Nivel 1: período < 5 s + ola > 0.5 m (narrativa)
- Nivel 2: período < 4 s + ola > 0.5 m (A tener en cuenta)
- Nivel 3: período < 3 s + ola > 0.5 m (Cuidado)

**Terral:**
- Nivel 1 (leve): viento offshore < 6 kn + rachas < 10 kn → A tener en cuenta
- Nivel 2 (relevante): viento 6–10 kn o rachas 10–16 kn → Cuidado
- Nivel 3 (fuerte): viento > 10 kn o rachas > 16 kn → Alerta
- Modificador: +1 nivel si ola > 0.6 m y spot no protegido (máx nivel 3)

### 8.5 Estado no recomendable — alerta consolidada

Cuando el estado es "no recomendable", los avisos individuales se fusionan en una única pastilla de alerta con un párrafo que explica el motivo principal. El título ya comunica la decisión; la pastilla añade el porqué desde un ángulo complementario.

No se muestran avisos individuales en este estado.

---

## 9. Sistema de copy

**Reglas:**
- No usar lenguaje técnico sin traducir
- Hablar en términos de: equilibrio, esfuerzo, comodidad, experiencia
- No alarmar innecesariamente
- Siempre explicar: qué pasa + qué implica

**Prohibido:** "rachas de 15 nudos", "variabilidad de 10 kn", "período de 4 segundos"

**Correcto:** "el viento empuja a ratos", "el mar tiene más movimiento de lo que parece", "las olas llegan irregulares"

---

## 10. Estructura UX — bloques y jerarquía

```
BLOQUE 1 · MOOD-LABEL
  texto pequeño, uppercase, color secundario
  Ej: "PISCINA" / "SE PUEDE SALIR"

BLOQUE 2 · TÍTULO
  H1, máximo protagonismo
  Ej: "El mar está de piscina"

BLOQUE 3 · SUBTÍTULO
  confirma el título, gris medio
  Ej: "Condiciones ideales. Sal sin dudar."

────────────────────────

BLOQUE 4 · NARRATIVA (viento + mar)
  Icono + título bold + descripción gris
  Los avisos de categoría "narrativa" quedan absorbidos aquí

────────────────────────

BLOQUE 5 · ALERTAS (solo si existen)
  Orden: Alerta → Cuidado → A tener en cuenta
  Máximo visible: 1 alerta + 2 avisos (el resto colapsado)
  En estado "no-recomendable": una sola pastilla consolidada

BLOQUE 6 · PARA QUIÉN ES
  Label pequeño + párrafo generativo
  Describe quién puede manejar las condiciones concretas de hoy

────────────────────────

BLOQUE 7 · DETALLE TÉCNICO
  Colapsado por defecto
  4 métricas: viento, rachas, ola, período
  3 párrafos por métrica + cierre narrativo
```

### Textos de estado

El bocadillo tiene dos funciones simultáneas:
- **Título**: nombra el estado (mood)
- **Subtítulo**: responde directamente "¿es para mí?" — sin rodeos

| Estado | Título | Subtítulo |
|---|---|---|
| Piscina | El mar está de piscina | Para cualquiera. No hay excusa para no salir. |
| Muy agradable | Va a estar muy bien | Cualquiera puede salir a gusto. |
| Se puede salir | Se puede salir | Si has salido alguna vez, no vas a tener problema. |
| Exigente | Condiciones exigentes | Es para quienes ya saben lo que hacen. |
| No recomendable | Mejor esperar | No es para nadie, independientemente del nivel. |

### Frase de cierre

Aparece al final del bloque de narrativa (o tras los avisos). No repite el subtítulo — lo complementa desde las condiciones concretas del día. El subtítulo habla del usuario; el cierre habla de lo que va a encontrar.

| Estado | Frase de cierre |
|---|---|
| Piscina | Aprovéchalo — estos días no abundan. |
| Muy agradable | Las condiciones acompañan. Vale la pena salir. |
| Se puede salir | El mar no va a sorprenderte. El viento, a ratos sí. |
| Exigente | Si tienes dudas, ya tienes la respuesta. |
| No recomendable | No merece la pena forzarlo. |

### El bloque "Para quién es" queda disuelto

No existe como bloque independiente. Su función la cubren:
1. El subtítulo del bocadillo (respuesta inmediata, directa)
2. La frase de cierre (reafirmación desde otro ángulo)

### Acordeón de avisos — "A saber antes de salir"

Nombre provisional pendiente de confirmar. Agrupa Cuidado + A tener en cuenta.
Dentro del acordeón, el nivel de gravedad se diferencia por código de color:
- bullet/icono naranja → Cuidado
- bullet/icono gris/amarillo → A tener en cuenta

La Alerta va siempre fuera del acordeón, en pastilla prominente.

### Jerarquía tipográfica

| Elemento | Tamaño | Peso | Color | Fondo |
|---|---|---|---|---|
| Mood-label | 11–12px | regular | estado/secundario | — |
| Título | 28–32px | bold | azul corporativo | — |
| Subtítulo | 15–16px | regular | gris medio | — |
| Narrativa título | 15px | bold | negro | — |
| Narrativa desc | 14px | regular | gris | — |
| Frase de cierre | 14px | regular | gris medio | — |
| Alerta copy | 14px | regular | oscuro | fondo alerta |
| Cuidado (acordeón) | 14px | regular | oscuro | — · bullet naranja |
| A tener en cuenta | 13px | regular | gris | — · bullet gris |

---

## 11. Pipeline de construcción

```javascript
diagnosticar(d, spot, weathercode)
  → calcularRiesgoTerral()     // terralLevel 0–3
  → getWarnings()              // array de avisos con {tipo, nivel, categoria, label, copy}
  → calcEstadoBase()           // estado inicial por reglas
  → aplicarAcumulacion()       // ajuste si ≥2 avisos nivel-3
  → buildAlertaConsolidada()   // solo si estado === 'no-recomendable'
  → { estado, warnings, alertaConsolidada }

buildBlocks(d, estado)         // narrativa viento + mar (absorbe avisos nivel-1)
getUserFit(estado, warnings)   // "para quién es" con contexto real
buildTechBlocks(d, estado)     // detalle técnico expandible
```

**Reglas de coherencia:**
- El técnico no contradice el estado
- El estado no oculta los avisos
- Los avisos no exageran
- Todo cuenta la misma historia

---

## 12. Ejemplo real validado

**Datos:** viento 5.4 kn · rachas 15.9 kn · variabilidad ~10 kn

**Resultado con el sistema v2:**
- Estado: **Se puede salir** (variabilidad > 6 kn activa el umbral)
- Aviso: variabilidad nivel 3 → **Cuidado** — "El viento base es suave, pero los cambios son bruscos y frecuentes."
- Rachas nivel 1 → absorbido en narrativa: "Viento suave, pero con algún empujón de vez en cuando."

_Sistema anterior (scoring ponderado): habría dado "bueno" sin ningún aviso. La inestabilidad real quedaba invisible._

---

## 13. Casos validados

| Caso | Datos | Estado | Avisos |
|---|---|---|---|
| Piscina perfecta | v:4 g:7 h:0.2 p:8 sin terral | piscina | ninguno |
| Variabilidad extrema | v:5.4 g:15.9 h:0.3 p:6 | se-puede-salir | variabilidad Cuidado |
| Terral leve en día bueno | v:5 g:8 h:0.3 p:7 terral-1 | muy-agradable | terral A tener en cuenta |
| Terral fuerte, condiciones ok | v:11 g:18 h:0.5 p:6 terral-3 | no-recomendable | alerta consolidada |
| Acumulación (2x nivel-3) | v:13 g:25 h:0.8 p:3.5 | no-recomendable | alerta consolidada |
| Borde ola 0.31m | v:5 g:8 h:0.31 p:8 | muy-agradable | ninguno |

---

## 14. Lo que NO hace Cocodrift (por diseño)

- No muestra datos para interpretar
- No requiere conocimiento técnico del usuario
- No tiene login ni historial
- No hace comparativas entre spots
- No usa nubes en el cálculo
- No tiene notificaciones push (por ahora)
- No soporta deportes distintos a SUP (arquitectura preparada para escalar)
