# Cocodrift — Estado del proyecto
_Actualizar al inicio/cierre de cada sesión de trabajo._
_Última actualización: abril 2026 — rama v1.1_

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
| `ui-lab` | Experimentos anteriores |
| `v1.1` | **Rama activa** — sistema diagnóstico v2 + nuevos bloques |

**Regla:** nunca mergear `v1.1` → `dev`/`main` sin confirmación explícita.

---

## Estado actual (abril 2026)

### Lo que está implementado en v1.1

- **Sistema de diagnóstico v2** — `js/score.js`
  - Reglas directas por variable (sin scoring ponderado)
  - 5 estados: piscina / muy-agradable / se-puede-salir / exigente / no-recomendable
  - `diagnosticar()` como punto de entrada único
  - `calcularVariabilidad()` — variable propia de Cocodrift
  - `getWarnings()` — 4 tipos de avisos con nivel + categoría + copy
  - Regla de acumulación (≥2 avisos nivel-3 → estado baja uno)
  - `buildAlertaConsolidada()` — pastilla única para no-recomendable
  - `getUserFit()` — función escrita (no conectada al DOM todavía)

- **app.js** — migrado a `diagnosticar()`, `ILLUS_MAP` actualizado
  - `renderWarnings()` — renderiza pastilla consolidada o acordeón según estado
  - `initWarningsToggle()` — acordeón "A saber antes de salir"
  - Frase de cierre conectada al DOM (`diagnosis-closing`)

- **HTML/CSS (bloques v1.1)**
  - `.diagnosis__closing` — frase de cierre atemporal
  - `.alerta-consolidada` — pastilla negra para no-recomendable
  - `.warnings-section` — acordeón "A saber antes de salir" con color coding por nivel
  - Versión v1.1 visible en menú y about sheet

### Lo que NO está implementado todavía

- **Rediseño visual completo** — el diseño actual (pantallazo de referencia) no refleja la spec de diseño. La estructura lógica está pero el CSS visual está pendiente. Ver sección de diseño abajo.
- **`getUserFit()` sin conectar al DOM** — función lista en score.js, sin renderizado
- **Token temporal** — pendiente de decisión de lógica completa (ver sección abajo)

---

## Diseño visual pendiente — spec completa

### Diseño actual (estado del pantallazo, lo que hay que cambiar)

El diseño actual muestra:
- Header azul full-width con nombre del spot grande (h1), ciudad + icono clima + temperatura, fecha/hora
- Franja "Ver más tarde" — tira delgada azul claro
- Bocadillo con borde azul, bg blanco, título bold azul + subtítulo gris azulado
- Ilustración del cocodrilo
- Bloques narrativos: texto bold azul centrado + descripción gris centrada (sin icono visible)
- Pastilla negra terral: icono ! circular · título uppercase · descripción · consejo en bold — elemento separado, encima del acordeón
- Acordeón "01 TEN EN CUENTA": cards azul-tinted con icono de viento + texto bold + desc
- Acordeón "02 INFORMACIÓN DETALLADA" y "03 INFORMACIÓN DETALLADA" colapsados

### Lo que debe cambiar en el rediseño visual

1. **Terral pill + pastilla negra actual → sustituir**
   - La pastilla negra grande con el terral debe desaparecer como elemento independiente
   - El terral pasa a ser un item dentro del acordeón "A saber antes de salir"
   - La terral-pill pequeña (badge arriba) también puede eliminarse — el acordeón la cubre
   - Excepción: si terral nivel 3 (Alerta), puede quedar fuera del acordeón como pastilla prominente

2. **Acordeón "01 TEN EN CUENTA" → sustituir por "A saber antes de salir"**
   - Nuevo nombre del acordeón
   - Items: label + bullet de color + copy (sin cards azules, sin iconos)
   - Color coding: rojo para Alerta, ámbar para Cuidado, gris para A tener en cuenta
   - El acordeón empieza cerrado
   - Muestra el número de avisos en el header del acordeón

3. **Frase de cierre** — aparece debajo de los bloques narrativos, antes del acordeón
   - Texto pequeño, gris, itálica o regular
   - Ej: "El mar no va a sorprenderte. El viento, a ratos sí."

4. **Bloques narrativos** — revisar peso visual
   - Actualmente el texto está centrado y es grande
   - Spec: icono + título bold 15px + descripción 14px gris, alineado a la izquierda

5. **Secciones técnicas** — renombrar
   - "02 INFORMACIÓN DETALLADA" → "Ver por qué" (ya hay un botón, unificar)
   - Eliminar duplicados / simplificar

6. **Tipografía según spec** (de `sistema-diagnostico.md` sección 10):

| Elemento | Tamaño | Peso | Color |
|---|---|---|---|
| Título bocadillo | 28–32px | bold | azul corporativo |
| Subtítulo bocadillo | 15–16px | regular | gris medio |
| Narrativa título | 15px | bold | negro |
| Narrativa desc | 14px | regular | gris |
| Frase de cierre | 14px | regular | gris medio |
| Alerta copy | 14px | regular | oscuro |
| Cuidado (acordeón) | 14px | regular | oscuro · bullet ámbar |
| A tener en cuenta | 13px | regular | gris · bullet gris |

### Orden de bloques en pantalla (definitivo)

```
HEADER (fijo arriba)
  ← Nombre del spot · ☰ menú

TIME-NAV
  días + slider de franja

────────────────────────── (scroll)

BOCADILLO
  Título (estado)
  Subtítulo (¿es para mí?)

ILUSTRACIÓN COCODRILO

BLOQUE AMBIENTAL
  icono clima · temperatura

NARRATIVA VIENTO
  icono · título bold · desc gris

NARRATIVA MAR
  icono · título bold · desc gris

FRASE DE CIERRE
  texto gris, atemporal

────────────

PASTILLA CONSOLIDADA (solo no-recomendable)
  bg negro · texto explicativo del motivo

O

ACORDEÓN "A saber antes de salir" (si hay avisos no-narrativa)
  [header: label · count · flecha]
  [items: bullet color · label · copy]

────────────

"VER POR QUÉ" (botón toggle)

BLOQUE TÉCNICO (colapsado por defecto)
  4 métricas: viento · rachas · ola · período
  3 párrafos por métrica + cierre

────────────────────────── (fin scroll)
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

El token se inyecta en título y subtítulo del bocadillo donde tenga sentido.
`getUserFit(estado, warnings, timeRef)` y `buildBlocks` recibirán `timeRef` cuando se implemente.

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
3. Rama activa: `v1.1`
4. **El próximo trabajo es el rediseño visual** — ver sección "Diseño visual pendiente"
5. No tocar `score.js` ni el sistema de diagnóstico — está cerrado
