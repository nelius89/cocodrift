# Cocodrift — Estado del proyecto
_Actualizar al inicio/cierre de cada sesión de trabajo._
_Última actualización: abril 2026._

---

## Qué es Cocodrift

App PWA de diagnóstico de condiciones para SUP (Stand Up Paddle).
Responde a: **¿Salgo al agua hoy?**

Traduce datos meteorológicos y marinos en una decisión clara, en lenguaje no técnico.
Sin login. Sin historial. Funciona offline (Service Worker).

**Stack:** HTML + CSS + JS vanilla · Open-Meteo API · Cloudflare Pages

**Repo:** `nelius89/cocodrift` (GitHub)
**URL producción:** `cocodrift.pages.dev`

---

## Ramas

| Rama | Función |
|---|---|
| `main` | Producción (Cloudflare auto-deploy) |
| `dev` | Staging |
| `ui-lab` | Experimentos de UI (rama actual) |

**Regla:** nunca mergear `ui-lab` → `dev`/`main` sin confirmación explícita.

---

## Estado actual (abril 2026)

### Lo que está implementado y funciona

- **Sistema de diagnóstico v2** — `js/score.js` reescrito
  - Reglas directas por variable (sin scoring ponderado)
  - 5 estados: piscina / muy-agradable / se-puede-salir / exigente / no-recomendable
  - Función `diagnosticar()` como punto de entrada único
  - `calcularVariabilidad()` — variable propia de Cocodrift
  - `getWarnings()` — 4 tipos de avisos con nivel + categoría + copy
  - Regla de acumulación (≥2 avisos nivel-3 → estado baja uno)
  - `buildAlertaConsolidada()` — pastilla única para estado no-recomendable
  - `getUserFit()` — bloque "para quién es" generativo
  - Todo el copy de avisos escrito por tipo/nivel

- **app.js** — migrado a `diagnosticar()`, `ILLUS_MAP` actualizado

- **Documentación**
  - `docs/sistema-diagnostico.md` — sistema completo con reglas, copy y UX
  - `docs/estado-proyecto.md` — este archivo

### Decisiones de copy cerradas en esta sesión

- Subtítulos del bocadillo reescritos: responden "¿es para mí?" de forma directa
- Frases de cierre atemporales: ángulo diferente al subtítulo, sin repetir
- Copy del Caso 6 (acumulación) corregido: sin lenguaje técnico
- Bloque "Para quién es" disuelto: función cubierta por subtítulo + frase de cierre
- Acordeón de avisos: nombre provisional "A saber antes de salir"
- Código de color dentro del acordeón para diferenciar Cuidado vs. A tener en cuenta
- Todo el copy es atemporal (sin "hoy", "otro día")

### Lo que NO está implementado todavía

- **HTML/CSS para los nuevos bloques:**
  - Bloque de avisos (A tener en cuenta / Cuidado / Alerta)
  - Pastilla consolidada para no-recomendable
  - Bloque "Para quién es"
  - Actualmente el UI solo muestra el terral como pill — el resto de avisos no se renderizan

- **`getUserFit()` no se llama desde app.js** — función escrita, sin conexión al DOM

- **`alertaConsolidada` no se renderiza** — `diagnosticar()` la devuelve, app.js la ignora

---

## Pendiente — Token temporal

El copy es atemporal, pero el usuario puede consultar condiciones de otras franjas/días.
Hay que definir un sistema de referencia temporal dinámica:

| Situación | Token |
|---|---|
| Franja actual, hoy | "ahora" |
| Franja posterior, hoy | "esta tarde" / "esta noche" |
| Día siguiente | "mañana" |
| Días futuros | "el martes" / "el miércoles" |

El token se inyecta en título y subtítulo del bocadillo donde tenga sentido.
`getUserFit(estado, warnings, timeRef)` y `buildBlocks` recibirán `timeRef` cuando se implemente.
El token lo genera `app.js` (o `api.js`) según `dayOffset` + índice de franja activa.

**No implementar hasta decidir la lógica completa.**

---

## Próximo paso

**Montar la estructura HTML/CSS de los nuevos bloques.**

En `index.html`, en la sección de resultados, añadir:

1. Bloque de avisos (después de narrativa viento/mar)
   - Renderizado desde `warnings` filtrado por categoría ≠ 'narrativa'
   - Orden: alerta → cuidado → a-tener-en-cuenta
   - En estado no-recomendable: sustituir por pastilla consolidada

2. Bloque "Para quién es"
   - Después de avisos, antes del detalle técnico
   - Texto desde `getUserFit(estado, warnings)`

3. En `app.js`, conectar al DOM:
   ```javascript
   const { estado, warnings, alertaConsolidada } = diagnosticar(d, currentSpot, d.weathercode);
   // renderWarnings(warnings, alertaConsolidada, estado) — función a escribir
   // renderUserFit(getUserFit(estado, warnings))         — función a escribir
   ```

---

## Decisiones de diseño tomadas (no reabrir sin motivo)

| Decisión | Motivo |
|---|---|
| Reglas directas vs. scoring ponderado | El scoring permitía que variables se compensaran entre sí |
| Variabilidad como variable propia | No existe en literatura técnica, Cocodrift la formaliza |
| Período ≥ 7 s para Piscina (no 5 s) | Fuentes técnicas: <5s ya es incómodo, óptimo real ≥10s |
| Terral siempre visible (nunca narrativa) | El mecanismo de riesgo existe desde nivel 1 |
| Terral nivel 1 = A tener en cuenta (no Alerta) | Alarmista si es leve; diluye el valor de la Alerta |
| No-recomendable = pastilla consolidada | Avisos individuales añaden ruido cuando el estado ya lo dice todo |
| 3 niveles de aviso: A tener en cuenta / Cuidado / Alerta | Alerta y Aviso sonaban demasiado similares |
| Mar incómodo máximo = Cuidado (no Alerta) | Es incomodidad, no riesgo de seguridad |

---

## Archivos clave

| Archivo | Qué contiene |
|---|---|
| `js/score.js` | Todo el sistema de diagnóstico |
| `js/app.js` | Orquestación y renderizado |
| `js/api.js` | Llamadas a Open-Meteo, caché, franjas |
| `js/storage.js` | localStorage: spots y caché |
| `index.html` | Estructura HTML de todas las vistas |
| `css/styles.css` | Estilos |
| `docs/sistema-diagnostico.md` | Spec completa del sistema |
| `docs/estado-proyecto.md` | Este archivo |

---

## Cómo retomar una sesión

1. Leer este archivo
2. Leer `docs/sistema-diagnostico.md` si se va a trabajar en lógica o copy
3. Rama activa: `ui-lab`
4. El próximo trabajo es HTML/CSS — no tocar `score.js` ni `app.js` hasta montar la estructura
