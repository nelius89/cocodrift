# Cocodrift — Briefing del proyecto

> Documento de contexto para IA. Contiene todo lo necesario para retomar el proyecto sin explicaciones previas.
> Última actualización: abril 2026

---

## Qué es Cocodrift

App web progresiva (PWA) que dice si puedes salir al agua hoy. Sin tecnicismos, sin tablas de datos, sin tener que interpretar nada: la app lee las condiciones del mar y te da una respuesta directa en un tono cercano y humano.

**La pregunta que responde:** ¿Salgo al agua hoy?

**El diferencial:** No compite con Windy o Windguru en datos. Compite en claridad. Cualquiera que quiera salir al mar entiende la respuesta, no solo los expertos.

**Mascota:** un cocodrilo con gafas de sol. Los cocodrilos viven en el agua y saben cuándo es segura — esa es la metáfora. El personaje es marca, no decoración.

---

## Visión de crecimiento

**v1 — Paddle surf (SUP).** Es el punto de partida porque es el deporte del creador y permite calibrar bien el sistema de scoring. Pero el sistema ya está diseñado para expandirse.

**Próximas actividades planeadas:**
- Kitesurf / windsurf (requiere viento más específico, rangos invertidos)
- Snorkel y natación en mar abierto (ola y visibilidad)
- Vela ligera (viento y dirección más críticos)
- Surf (período y ola prioritarios, viento secundario)

La arquitectura permite añadir actividades con pesos distintos en el scoring sin reescribir el sistema. Cada actividad tendrá su propia lógica de qué condición es buena o mala.

**Más adelante:** Posible extensión a actividades de montaña (senderismo, escalada) con APIs meteorológicas terrestres. El nombre Cocodrift no limita la propuesta.

---

## Stack técnico

| Pieza | Rol |
|---|---|
| **HTML + CSS + JS vanilla** | Frontend. Sin frameworks. App estática. |
| **GitHub** (`nelius89/cocodrift`) | Repositorio. Push a `main` → deploy automático |
| **Cloudflare Pages** | Hosting + CDN. Rama `main` = producción, `dev` = preview |
| **Open-Meteo API** | Datos meteorológicos y marinos. Gratuito, sin API key, CORS nativo |
| **localStorage** | Persistencia de spots y caché de datos. Sin backend ni login |
| **Service Worker** | PWA offline-first. Cache versionado (`coco-vX`) |
| **Cloudflare Workers** | Worker activo: `coco-suggestions` → recibe sugerencias y las guarda en Notion |
| **Cloudflare Web Analytics** | Analytics de uso. Sin cookies, GDPR-friendly |

### Flujo de deploy
```
git push origin dev   →  preview en dev.sup-app.pages.dev
git push origin main  →  producción en sup-app.pages.dev
```
(El proyecto en Cloudflare Pages aún se llama `sup-app` — pendiente de renombrar)

### Archivos principales
```
index.html          ← Estructura HTML de todas las vistas y sheets
css/styles.css      ← Todos los estilos (tokens, vistas, componentes)
js/app.js           ← Lógica de navegación, render y eventos
js/score.js         ← Sistema de diagnóstico: scoring, estados, copys, bloques
js/api.js           ← Llamadas a Open-Meteo, franjas horarias, caché
js/storage.js       ← Gestión de spots en localStorage
js/wheel.js         ← Scroll wheel (no en uso activo)
sw.js               ← Service Worker. Bump de versión al hacer cambios de assets
manifest.json       ← Configuración PWA
```

---

## Fuente de datos: Open-Meteo

### Dos llamadas por consulta

**Marine API** — olas y mar:
```
GET https://marine-api.open-meteo.com/v1/marine
  ?latitude={lat}&longitude={lon}
  &hourly=wave_height,wave_direction,wave_period,
          swell_wave_height,wind_wave_height,wind_wave_period
  &timezone=Europe/Madrid&forecast_days=7
```

**Forecast API** — viento y tiempo:
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude={lat}&longitude={lon}
  &hourly=wind_speed_10m,wind_gusts_10m,wind_direction_10m,
          weathercode,temperature_2m,cloudcover
  &timezone=Europe/Madrid&forecast_days=7
```

### Caché
Respuesta guardada en localStorage con timestamp. No se vuelve a llamar si han pasado menos de 60 minutos.

### Conversiones
- Viento km/h → nudos: `kn = km/h / 1.852`
- Grados → punto cardinal: función por rangos de 22.5°

---

## Spots

### Hardcodeados (no borrables por el usuario)
```json
[
  { "id": "pont-petroli", "name": "Pont del Petroli", "city": "Badalona",
    "lat": 41.4421, "lon": 2.2385, "offshore_range": [225, 315] },
  { "id": "platja-llevant", "name": "Platja del Llevant", "city": "Barcelona",
    "lat": 41.3934, "lon": 2.2048, "offshore_range": [225, 315] }
]
```

### Spots de usuario
Añadidos via geocoding (Open-Meteo geocoding API). Mismo esquema JSON. Guardados en localStorage. Borrables con tap largo.

---

## Sistema de diagnóstico — 3 capas

### CAPA 1 — Score global (0–10) y los 5 estados

**Pesos del score:**
```
Viento   35%  ·  Ola   35%  ·  Rachas   15%  ·  Período   10%  ·  Nubes   5%
```

**Sub-scores de viento (kn):**
≤6 → 10 · ≤10 → 8 · ≤14 → 5 · ≤19 → 3 · >19 → 0

**Sub-scores de ola (m):**
≤0.3 → 10 · ≤0.6 → 8 · ≤1.0 → 5 · ≤1.5 → 2 · >1.5 → 0

**Sub-scores de rachas (kn):**
≤8 → 10 · ≤12 → 7 · ≤16 → 4 · ≤20 → 2 · >20 → 0

**Sub-scores de período (s):**
≥7 → 10 · ≥5 → 8 · ≥4 → 6 · <4 → 3

**Sub-scores de nubes (%):**
≤20 → 10 · ≤50 → 8 · ≤80 → 6 · >80 → 5

**Los 5 estados y sus umbrales:**

| Estado | Score | Título | Subtítulo |
|---|---|---|---|
| `perfecto` | ≥ 8.5 | Hoy es de los buenos | Yo no me lo perdería |
| `bueno` | 7.0–8.5 | Hoy se puede salir | Si te apetece, se está a gusto |
| `aceptable` | 5.0–7.0 | Hoy, depende... | Solo si estás acostumbrado |
| `complicado` | 3.0–5.0 | Mejor otro día | Hoy lo dejaría |
| `no-salir` | < 3.0 o tormenta (weathercode ≥ 95) | Hoy mejor quedarse en casa | No está el agua para nadie |

### CAPA 2 — Aviso terral

El terral (viento de tierra hacia el mar) es un riesgo de seguridad real e independiente del score. Aparece como pill compacta encima del diagnóstico. Tiene 3 niveles:

| Nivel | Condición | Label pill | Consejo |
|---|---|---|---|
| 1 — Leve | windKn < 6 y gustKn < 10 | TERRAL LEVE | Puedes salir, pero no te alejes de la orilla |
| 2 — Relevante | windKn 6–10 o rachas moderadas | TERRAL RELEVANTE | Quédate cerca de la orilla en todo momento |
| 3 — Fuerte | windKn > 10 o gustKn > 16 | TERRAL FUERTE | Hoy es mejor quedarse en tierra |

`offshore_range` para BCN/Badalona: [225, 315] grados.

### CAPA 3 — Info técnica (sheet expandible)

Sheet en la parte inferior, siempre visible en modo peek (handle + etiqueta "Desplegar información técnica completa"). Al expandir, fondo de la vista cambia a azul. Contiene 4 métricas con tarjeta de valor + 3 párrafos explicativos cada una:
- Viento (kn)
- Rachas (kn)
- Ola (m)
- Período (s)

---

## Estructura de pantallas

### Home (fondo azul #314fff)
- Animación de 3 frames del cocodrilo (ilustraciones FR1.png, FR2.png, FR-3.png)
- Lista de spots: cada spot es un botón pill con nombre. A la izquierda, abreviatura de ciudad
- Tap en spot → pantalla Resultados
- Tap largo en spot de usuario → modo borrar (badge ✕)
- Botón + al final de la lista → abre buscador de playas
- Hamburger (arriba derecha) → menú lateral con "Acerca de Cocodrift" y "Sugerencias"

### Resultados (fondo beige #f9f6ef)

**Bloque 1 — Header + navegación temporal**
- Header: ← (back) · nombre spot + icono tiempo + temperatura (centrados) · hamburger
- Selector de días (7 botones: Hoy, Sáb, Dom...)
- Slider de franja horaria (0–6)
- Franja activa: icono + nombre de franja (encima) + horas (debajo). Ejemplo: "MAÑANA / 6h–8h"

**Bloque 2 — Diagnóstico principal**
- Pill de terral (si aplica) — negra, compacta, clicable para expandir el sheet
- Ilustración del cocodrilo (visible solo en estados perfecto y bueno por ahora)
- Título del estado (grande, azul)
- Subtítulo del estado (gris azulado)
- Bloque viento: icono (izquierda) + título bold (azul) + descripción (gris claro). Alineado a la izquierda
- Bloque mar: ídem

**Bloque 3 — Sheet técnico (expandible)**
- Handle con barra y etiqueta
- Al expandir: fondo de pantalla → azul
- Bloque terral (si aplica), 4 tech-rows (Viento / Rachas / Ola / Período), cierre

---

## Franjas horarias

| Índice | Nombre | Horas |
|---|---|---|
| 0 | Madrugada | 0h–5h |
| 1 | Mañana | 6h–8h |
| 2 | Media mañana | 9h–11h |
| 3 | Mediodía | 12h–14h |
| 4 | Tarde | 15h–17h |
| 5 | Atardecer | 18h–20h |
| 6 | Noche | 21h–23h |

Los datos de cada franja son el promedio de los valores horarios dentro de ese bloque. Al cargar, se selecciona automáticamente la franja correspondiente a la hora actual.

---

## Sistema de bloques (copys de pantalla principal)

La función `buildBlocks(d, estado)` genera los textos del Bloque 2 combinando viento + rachas y ola + período en frases naturales:

- `windTitle` — frase corta que resume viento y rachas (bold, azul)
- `windDesc` — consecuencia para el remador (gris claro)
- `seaTitle` — frase corta que resume ola y período (bold, azul)
- `seaDesc` — consecuencia para el remador (gris claro)

Ejemplos reales:
- windTitle: "El viento sopla muy suave y constante." / windDesc: "No lo vas a notar al remar."
- seaTitle: "El mar está plano, con olas cortas y algo nerviosas." / seaDesc: "Puede haber algún movimiento irregular puntual."

---

## Sistema visual

| Token | Valor | Uso |
|---|---|---|
| `--blue` | `#314fff` | Color principal, fondo Home, acentos |
| `--beige` | `#f9f6ef` | Fondo Resultados, textos sobre azul |
| `--black` | `#0a0a0a` | Textos |
| `--white` | `#ffffff` | Textos sobre azul expandido |

**Tipografía:** Geist Mono (Google Fonts). Una sola familia, todos los pesos desde ella.

**Modo expandido:** cuando el sheet técnico está abierto, `body.sheet-expanded` pone el fondo de `.view--results` en azul y adapta todos los colores del header a blanco.

---

## Ilustraciones actuales

Ubicadas en `assets/illustrations/`:
- `FR1.png`, `FR2.png`, `FR-3.png` — animación de 3 frames en la Home
- `Perfecto.png` — ilustración para el estado perfecto (en resultados)
- `Bueno.png` — ilustración para el estado bueno (en resultados)
- Estados aceptable, complicado y no-salir: sin ilustración por ahora (espacio vacío)

Iconos PWA en `assets/icons/`: `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`.

---

## Lo que está fuera de v1

- Notificaciones push
- Historial de sesiones del usuario
- Comparativa de spots en paralelo
- Datos de mareas
- Login / sync entre dispositivos
- Soporte a otras actividades (kite, surf, vela...) — arquitectura preparada, pendiente de implementar
