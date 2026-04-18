# SUP Conditions App — Briefing definitivo para Claude Code

---

## Visión del producto

App web personal para saber en segundos si el mar está bien para salir a hacer paddle surf. Entra, ves al cocodrilo, entiendes el diagnóstico. Sin ruido.

---

## Stack técnico

| Pieza | Rol | Notas |
|---|---|---|
| **GitHub** | Repositorio + CI/CD | Push a `main` → deploy automático |
| **Cloudflare Pages** | Hosting + CDN | Free tier, HTTPS, dominio propio opcional |
| **Open-Meteo API** | Datos en tiempo real | Gratuito, sin API key, CORS nativo |
| **localStorage** | Persistencia de spots | Sin backend, sin login, suficiente para v1 |
| **Supabase** | — | No necesario en v1. Añadir si se requiere sync entre dispositivos o login |
| **Cloudflare Workers** | — | No necesario en v1. Útil si se añaden notificaciones push en el futuro |

### Flujo de deploy
```
Desarrollas en local → git push → Cloudflare Pages build → live en <60s
```

### Tecnología frontend
HTML + CSS + JavaScript vanilla. Sin frameworks. App estática.

---

## Fuente de datos: Open-Meteo

### Dos llamadas por consulta

**Marine API** — olas:
```
GET https://marine-api.open-meteo.com/v1/marine
  ?latitude={lat}&longitude={lon}
  &hourly=wave_height,wave_direction,wave_period,
          swell_wave_height,wind_wave_height,wind_wave_period
  &timezone=Europe/Madrid
  &forecast_days=7
```

**Forecast API** — viento y tiempo:
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude={lat}&longitude={lon}
  &hourly=wind_speed_10m,wind_gusts_10m,wind_direction_10m,weathercode
  &timezone=Europe/Madrid
  &forecast_days=7
```

### Caché
Guardar respuesta en localStorage con timestamp. No rellamar si han pasado menos de 60 minutos.

### Conversiones necesarias
- Viento km/h → nudos: `kn = km_h / 1.852`
- Grados → nombre de dirección: función por rangos de 22.5°
- Grados → tipo onshore/offshore/side: ver tabla de spots

---

## Spots

### Hardcodeados (no borrables)

```json
[
  {
    "id": "pont-petroli",
    "name": "Pont del Petroli",
    "city": "Badalona",
    "lat": 41.4421,
    "lon": 2.2385,
    "default": true,
    "offshore_range": [225, 315]
  },
  {
    "id": "platja-llevant",
    "name": "Platja del Llevant",
    "city": "Barcelona",
    "lat": 41.3934,
    "lon": 2.2048,
    "offshore_range": [225, 315]
  }
]
```

### Spots de usuario (localStorage)
Mismo esquema JSON. Añadidos via geocoding. Máximo recomendado: 10.

### Nota sobre resolución geográfica
Pont del Petroli y Platja del Llevant están a 6.1 km. El modelo marino tiene resolución de 5 km. Los datos serán prácticamente idénticos (±0.1m ola, ±1kn viento). La distinción entre spots tiene valor organizativo y de contexto, no de datos diferenciados.

### Estructura localStorage
```json
{
  "spots": [ ...array de spots de usuario... ],
  "activeSpotId": "pont-petroli",
  "cache": {
    "pont-petroli": {
      "timestamp": 1713200000,
      "marine": { ...respuesta API... },
      "forecast": { ...respuesta API... }
    }
  }
}
```

---

## Sistema de diagnóstico

### Arquitectura en tres capas

```
CAPA 1 — Score global (0–10)
  Determina: estado, ilustración del cocodrilo, título, descripción

CAPA 2 — Flag offshore
  Independiente del score. Aparece como banner si el viento
  es de tierra hacia el mar (potencialmente peligroso aunque el
  score sea alto)

CAPA 3 — Métricas individuales
  Cada variable explicada por separado con valor, etiqueta y frase
```

---

### Capa 1: Cálculo del score

```javascript
function calcularScore(viento_kn, ola_m, racha_kn, periodo_s, nubes_pct) {

  function scoreViento(kn) {
    if (kn <= 6)  return 10;
    if (kn <= 10) return 8;
    if (kn <= 14) return 5;
    if (kn <= 19) return 3;
    return 0;
  }

  function scoreOla(m) {
    if (m <= 0.3)  return 10;
    if (m <= 0.6)  return 8;
    if (m <= 1.0)  return 5;
    if (m <= 1.5)  return 2;
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

  return (
    scoreViento(viento_kn)  * 0.35 +
    scoreOla(ola_m)         * 0.35 +
    scoreRacha(racha_kn)    * 0.15 +
    scorePeriodo(periodo_s) * 0.10 +
    scoreNubes(nubes_pct)   * 0.05
  );
}
```

### Capa 1: Los 5 estados

#### 🟢 PERFECTO — score ≥ 8.5
- **Condiciones:** Viento ≤6kn · Ola ≤0.3m
- **Título:** ¡Esto es una piscina, tío!
- **Descripción:** El mar está en calma total. Hoy sales y no gastas ni energía. Perfecto para cualquier nivel.
- **Escena cocodrilo:** Estirado boca arriba sobre la tabla, flotando sin remo, gafas de sol, manos detrás de la cabeza. Mar completamente plano. Una bebida flotando a su lado.

#### 🟡 BUENO — score 7.0–8.5
- **Condiciones:** Viento 7–10kn · Ola 0.3–0.6m
- **Título:** Dale, que está bien.
- **Descripción:** Hay algo de movimiento pero nada que no puedas manejar. Se nota el viento, la ola te balancea un poco. Disfrútalo.
- **Escena cocodrilo:** De pie sobre la tabla, remando. Gafas puestas, postura relajada pero activa. Olitas pequeñas alrededor. Cara de satisfacción.

#### 🟠 ACEPTABLE — score 5.0–7.0
- **Condiciones:** Viento 11–14kn · Ola 0.6–1.0m
- **Título:** Ehh… puedes, pero ojo.
- **Descripción:** El mar está movido. Si tienes experiencia, adelante. Si estás empezando, mejor espera a mañana.
- **Escena cocodrilo:** Sentado sobre la tabla (no de pie), remando con esfuerzo visible. Olas más grandes alrededor. Cara de concentración. Las gafas torcidas.

#### 🔴 COMPLICADO — score 3.0–5.0
- **Condiciones:** Viento 15–19kn · Ola 1.0–1.5m
- **Título:** Hoy, playa pero sin tabla.
- **Descripción:** Puedes ir a la playa, tomar el sol, mojarte los pies. Pero la tabla se queda en casa. El mar no está para bromas.
- **Escena cocodrilo:** En la arena, sentado en una toalla. La tabla clavada en la arena a su lado. Mirando el mar con cara de «uf». Olas grandes al fondo. Actitud resignada pero tranquila.

#### ⛔ NO SALIR — score < 3.0
- **Condiciones:** Viento ≥20kn · Ola ≥1.5m · o weathercode tormenta (≥95)
- **Título:** Ni se te ocurra.
- **Descripción:** Fuera está feo. Quédate en casa, ponte una peli y espera a que pase. En serio.
- **Escena cocodrilo:** Dentro de casa, asomado a la ventana con cara de horror mirando la tormenta. La tabla apoyada contra la pared interior. Manta o taza en la mano. Interior acogedor vs caos fuera.

---

### Capa 2: Flag offshore

```javascript
function esOffshore(grados, spot) {
  const [min, max] = spot.offshore_range; // [225, 315] para BCN/Badalona
  return grados >= min && grados <= max;
}
```

**Cuando se activa:**
- Símbolo de prohibido del que asoma el cocodrilo con cara triste
- Aparece encima del diagnóstico principal
- No modifica el score ni el estado
- Texto: *"Ojo al viento terral — El viento sopla de tierra hacia el mar. El agua parece en calma, pero te puede arrastrar lejos sin darte cuenta. Si sales, no te alejes de la orilla."*

---

### Capa 3: Métricas individuales

Cada métrica muestra: icono · valor numérico · etiqueta · frase en tono cercano.

#### 💨 Viento
| Rango | Etiqueta | Frase |
|---|---|---|
| 0–6 kn | 🟢 Calma total | No lo notarás ni en el pelo. |
| 7–10 kn | 🟡 Brisa ligera | Se nota pero no molesta. |
| 11–14 kn | 🟠 Viento moderado | Remar contra él ya cuesta. |
| 15–19 kn | 🔴 Viento fuerte | El mar está revuelto. |
| ≥20 kn | ⛔ Demasiado viento | No es seguro estar en el agua. |

#### 🌊 Ola
| Rango | Etiqueta | Frase |
|---|---|---|
| 0–0.3 m | 🟢 Plana | Como una piscina. Sin movimiento. |
| 0.3–0.6 m | 🟡 Pequeña | Algo de balanceo. Agradable. |
| 0.6–1.0 m | 🟠 Mediana | Te mueve. Necesitas equilibrio. |
| 1.0–1.5 m | 🔴 Grande | Difícil mantenerse de pie. |
| ≥1.5 m | ⛔ Muy grande | Peligroso para SUP recreativo. |

#### 🌬️ Rachas
| Rango | Etiqueta | Frase |
|---|---|---|
| 0–8 kn | 🟢 Estable | Sin sorpresas. El viento es constante. |
| 9–12 kn | 🟡 Alguna racha | Pequeños empujones puntuales. |
| 13–16 kn | 🟠 Rachas fuertes | Pueden pillarte descolocado. |
| ≥17 kn | ⛔ Rachas peligrosas | Una racha puede echarte al agua lejos de la orilla. |

#### ⏱️ Período de ola
| Rango | Etiqueta | Frase |
|---|---|---|
| 0–3 s | 🔴 Ola caótica | Corta y desordenada. El mar está nervioso. |
| 4–6 s | 🟡 Ola normal | Ritmo normal. Manejable. |
| ≥7 s | 🟢 Ola organizada | Ola larga y predecible. La mejor. |

#### 🧭 Dirección del viento
| Tipo | Etiqueta | Frase |
|---|---|---|
| Onshore (E/SE) | 🟡 Viento de mar | Empuja hacia la orilla. Sin riesgo de alejarte. |
| Side-shore (N/S) | 🟢 Viento lateral | El más neutro. Solo vigila la deriva. |
| Offshore (W/NW) | ⚠️ Viento terral | Parece tranquilo pero te aleja del mar. ¡Cuidado! |

---

## Sistema visual

| Token | Valor | Uso |
|---|---|---|
| `--color-bg-home` | `#314fff` | Fondo de la pantalla Home |
| `--color-bg-results` | `#f9f6ef` | Fondo de la pantalla de resultados |
| `--color-accent` | `#314fff` | Color principal de UI, botones, iconos |
| `--color-illustration-home` | `#f9f6ef` | Ilustración del cocodrilo sobre fondo azul |
| `--color-illustration-results` | `#314fff` | Ilustración del cocodrilo sobre fondo beige |

**Paleta**: beige (`#f9f6ef`) y azul (`#314fff`). Monocromático — sin tercer color por ahora. Textos en negro o en el color contrario del fondo según contexto.

**Tipografía**: Geist Mono (Google Fonts / Vercel). Una sola familia, todos los pesos desde ella.

---

## Flujo de navegación

```
HOME (selección de playa)
  └── tap en playa → RESULTADOS (diagnóstico)
                          └── tap en "←" (back) → HOME
```

- La Home es el punto de entrada siempre.
- No hay selector de spots dentro de la pantalla de resultados.
- Para cambiar de playa: volver atrás desde Resultados → Home → seleccionar otra playa.
- Añadir y borrar spots también se gestiona desde Home.

---

## Estructura de pantallas (wireframes)

### Pantalla 1 — Home (selección de playa)

```
┌──────────────────────────────────────────┐  fondo: #314fff
│                                          │
│              [LOGO / nombre app]         │
│                                          │
│         [ILUSTRACIÓN COCODRILO]          │  beige sobre azul
│           (escena neutra / marca)        │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│   ┌──────────────────────────────────┐   │
│   │  Pont del Petroli · Badalona     │   │  ← spot hardcoded
│   └──────────────────────────────────┘   │
│                                          │
│   ┌──────────────────────────────────┐   │
│   │  Platja del Llevant · Barcelona  │   │  ← spot hardcoded
│   └──────────────────────────────────┘   │
│                                          │
│   ┌──────────────────────────────────┐   │
│   │  Mi spot personalizado           │   │  ← spot de usuario
│   │                              [✕] │   │  ← tap+hold → borrar
│   └──────────────────────────────────┘   │
│                                          │
│   ┌──────────────────────────────────┐   │
│   │  [+] Añadir playa                │   │  ← abre buscador
│   └──────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

**Comportamiento:**
- Spots hardcodeados: no tienen opción de borrar
- Spots de usuario: tap normal = seleccionar · tap+hold = opción borrar
- Tap en cualquier playa → navega a Pantalla 2 (Resultados)

---

### Pantalla 2 — Resultados (diagnóstico)

```
┌──────────────────────────────────────────┐  fondo: #f9f6ef
│  ← Pont del Petroli                      │  ← back a Home + nombre spot
├──────────────────────────────────────────┤
│                                          │
│  ⚠️ OJO AL VIENTO TERRAL (si aplica)     │  ← Capa 2, solo si offshore
│                                          │
│       [ILUSTRACIÓN COCODRILO]            │  azul sobre beige
│                                          │
│    ¡Esto es una piscina, tío!            │  ← Título (Capa 1)
│    El mar está en calma total...         │  ← Descripción (Capa 1)
│                                          │
├──────────────────────────────────────────┤
│  💨 4 kn      🟢 Calma total             │
│  "No lo notarás ni en el pelo."          │
│                                          │
│  🌊 0.2 m     🟢 Plana                   │  ← Capa 3, métricas
│  "Como una piscina. Sin movimiento."     │
│                                          │
│  🌬️ 5 kn      🟢 Estable                │
│  "Sin sorpresas. El viento es constante."│
│                                          │
│  ⏱️ 5 s       🟡 Ola normal              │
│  "Ritmo normal. Manejable."              │
│                                          │
│  🧭 NE        🟡 Viento de mar           │
│  "Empuja hacia la orilla."               │
│                                          │
├──────────────────────────────────────────┤
│  ◀─────────[●]─────────────────────▶    │  ← barra deslizable (franjas)
│  Mañana · 06h–08h                        │  ← etiqueta franja activa
└──────────────────────────────────────────┘
```

**Barra temporal (parte inferior):**
- Barra horizontal deslizable con el dedo (swipe izquierda/derecha)
- Recorre los 7 días × franjas horarias = ~49 posiciones
- La franja activa se selecciona automáticamente por hora actual al cargar
- La etiqueta muestra: día (Hoy / Mañana / Lun 21 abr) + nombre de franja
- Al deslizar, todos los datos de la pantalla se actualizan en tiempo real

---

### Overlay — Añadir playa (desde Home)

```
┌──────────────────────────────────────────┐
│  Buscar playa                       [✕]  │
│  ┌────────────────────────────────────┐  │
│  │  🔍 "Valencia..."                  │  │  ← input de búsqueda
│  └────────────────────────────────────┘  │
│                                          │
│  Valencia, España                        │  ← resultado geocoding
│  Valencia Beach, EEUU                    │
│  ...                                     │
│                                          │
│  [Seleccionar] → input nombre            │
│  ┌────────────────────────────────────┐  │
│  │  Mi nombre para este spot          │  │
│  └────────────────────────────────────┘  │
│                   [Guardar]              │
└──────────────────────────────────────────┘
```

---

## Gestión de spots (UI)

Toda la gestión de spots ocurre en la **Home**, nunca en la pantalla de Resultados.

- **Tap en spot** → navega a Resultados con los datos de ese spot
- **Tap en spot de usuario + mantener pulsado** → aparece opción de borrar
- **Tap en "+"** → abre overlay de búsqueda
  - Llama a `geocoding-api.open-meteo.com/v1/search?name={query}&language=es`
  - Muestra lista de resultados con nombre y país
  - Usuario selecciona → puede personalizar el nombre → se guarda en localStorage
- **Spots hardcodeados** (Pont del Petroli, Platja del Llevant) → no muestran opción de borrar

---

## Franjas horarias

Agrupar datos horarios en bloques de 3h promediando los valores:

| Franja | Horas |
|---|---|
| Madrugada | 00h–05h |
| Mañana | 06h–08h |
| Media mañana | 09h–11h |
| Mediodía | 12h–14h |
| Tarde | 15h–17h |
| Atardecer | 18h–20h |
| Noche | 21h–23h |

La franja activa se selecciona automáticamente por hora actual. El usuario puede navegar libremente.

---

## Personaje: el cocodrilo

- Cocodrilo con gafas de sol
- 5 escenas fijas correspondientes a los 5 estados (ver arriba)
- 1 variante de Capa 2: sale asomándose desde detrás de un símbolo de prohibido, con cara triste
- 1 escena de Home: neutra / bienvenida (sin diagnóstico)
- Estilo: ilustración flat, carácter, no demasiado infantil
- Formato: SVG o PNG con fondo transparente
- **Estado en desarrollo**: las ilustraciones las hace Manel. En código, usar `<div class="illus-placeholder">` dimensionado correctamente. No usar imágenes de stock ni generadas.

### Placeholders en código

| Contexto | Clase sugerida | Dimensiones aprox |
|---|---|---|
| Logo (Home) | `.logo-placeholder` | 120×40px |
| Cocodrilo Home | `.illus-placeholder--home` | 240×240px |
| Cocodrilo Resultados | `.illus-placeholder--results` | 200×200px |
| Cocodrilo offshore (Capa 2) | `.illus-placeholder--offshore` | 80×80px |

---

## Lo que queda fuera de v1

- Notificaciones push
- Historial de sesiones del usuario
- Comparativa de spots en paralelo
- Datos de mareas (requeriría API adicional)
- Login / sync entre dispositivos
