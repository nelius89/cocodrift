# Cocodrift — Estado del proyecto
_Actualizar al inicio/cierre de cada sesión de trabajo._
_Última actualización: abril 2026 — rama v2.0_

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
| `ui-lab` | Experimentos visuales anteriores (archivada) |
| `v1.1` | Sistema diagnóstico v2 — base de v2.0 |
| `v2.0` | **Rama activa** — rediseño visual completo |

**Regla:** nunca mergear `v2.0` → `dev`/`main` sin confirmación explícita.

---

## Estado actual (abril 2026)

### Lo que está implementado en v2.0

**Header / Hero (zona azul)**
- Topbar: botón atrás (izquierda) + estrella favorito (derecha), misma línea
- Nombre del spot centrado (18px/700), una línea con ellipsis
- Ciudad centrada con icono pin

**Navegación temporal**
- 3 tabs fijos: Hoy · Mañana · 7 días (pill selector animado)
- Lógica: `currentDay = 0/1`, `showSevenDay` flag para tab 7 días
- Vista 7 días: pantalla vacía (placeholder)

**Franjas horarias**
- 4 franjas: Amanecer (6–9h) · Día (9–18h) · Tarde (18–21h) · Noche (21–6h)
- Visual: nombre de franja + icono weather real del API + temperatura en grados
- **Sliding pill indicator**: indicator absoluto animado con `transform: translateX`, `cubic-bezier(0.25, 0.46, 0.45, 0.94)`, color transition en texto

**Zona resultado (scrollable, fondo beige)**
- Diagnosis: pre-label + ilustración por estado + título
- 3 bloques narrativos con icono SVG + título bold + descripción
- Tech blocks inline: Viento (dirección + compass + velocidad + rachas + terral + variabilidad) y Oleaje (altura + período + dirección + fondo + viento + tipo)
- Info sheets por métrica (bottom sheet con rangos)
- Popup "A saber" y Sugerencias como bottom sheets

**Sistema de diagnóstico (`score.js`)** — sin cambios desde v1.1
- 5 estados, reglas directas, `diagnosticar()`, `calcularVariabilidad()`, `buildNarrativeBlocks()`

### Pendiente / no implementado

- Vista de 7 días — placeholder vacío, lógica sin construir
- Token temporal en el copy (ver decisiones)
- `getUserFit()` — función en score.js sin conectar al DOM

---

## Orden de bloques en pantalla (implementado)

```
ZONA AZUL (fija)
  ← back                              ★ favorito
  [Nombre del spot centrado]
  [📍 Ciudad]
  [Hoy]  [Mañana]  [7 días]
  ─────────────────────────────
  [Amanecer ☀ 18°] [Día ⛅ 22°] [Tarde 🌤 20°] [Noche 🌙 16°]

ZONA BEIGE (scroll)
  ¿Está para salir?
  [ilustración]
  TÍTULO DEL ESTADO

  [bloque narrativo 1: qué te vas a encontrar]
  [bloque narrativo 2: qué te va a pedir]
  [bloque narrativo 3: para quién encaja]

  [tech block: Viento]
  [tech block: Oleaje]

  nota legal inferior
```

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

**No implementar hasta decidir la lógica completa.**

---

## Decisiones de diseño tomadas (no reabrir sin motivo)

| Decisión | Motivo |
|---|---|
| Reglas directas vs. scoring ponderado | El scoring permitía que variables se compensaran entre sí |
| Variabilidad como variable propia | No existe en literatura técnica de SUP, Cocodrift la formaliza |
| Período ≥ 7 s para Piscina (no 5 s) | Fuentes técnicas: <5s ya es incómodo, óptimo real ≥10s |
| Terral siempre visible (nunca narrativa) | El mecanismo de riesgo existe desde nivel 1 |
| Terral nivel 1 = A tener en cuenta (no Alerta) | Alarmista si es leve; diluye el valor de la Alerta |
| No-recomendable = pastilla consolidada | Avisos individuales añaden ruido cuando el estado ya lo dice todo |
| 3 niveles de aviso: A tener en cuenta / Cuidado / Alerta | Alerta y Aviso sonaban demasiado similares |
| Mar incómodo máximo = Cuidado (no Alerta) | Es incomodidad, no riesgo de seguridad |
| "Para quién es" disuelto en subtítulo + frase de cierre | El subtítulo responde "¿es para mí?" directamente |
| Acordeón "A saber antes de salir" | Nombre provisional — pendiente confirmar |
| Todo el copy es atemporal (sin "hoy", "otro día") | Token temporal pendiente de implementar |

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
| `docs/sistema-diagnostico.md` | Spec completa del sistema (reglas, copy, UX) |
| `docs/estado-proyecto.md` | Este archivo |

---

## Cómo retomar una sesión

1. Leer este archivo
2. Leer `docs/sistema-diagnostico.md` si se va a trabajar en lógica o copy
3. Rama activa: `v2.0`
4. **Próximos trabajos posibles:** vista 7 días, token temporal, refinado visual
5. No tocar `score.js` ni el sistema de diagnóstico — está cerrado
