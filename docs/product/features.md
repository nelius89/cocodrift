# Features — Inventario por fase

_Última actualización: 2026-04-25_

---

## V1 (base — implementada en rama v1.1)

### Core implementado
- [x] Diagnóstico principal: 5 estados con título + ilustración
- [x] Sistema de diagnóstico v2: reglas directas, `diagnosticar()`, `calcularVariabilidad()`
- [x] 3 bloques narrativos (qué te encontrarás / qué te pedirá / para quién encaja)
- [x] Tech blocks: viento (dirección, media, rachas, terral, variabilidad) + oleaje (altura, período, dirección, fondo, tipo)
- [x] Info sheets por métrica (bottom sheet con rangos explicados)
- [x] Aviso de terral con nivel + copy
- [x] 4 franjas horarias: Amanecer / Día / Tarde / Noche
- [x] Añadir spots propios (búsqueda por geocoding — Nominatim)
- [x] Caché de API (60 min TTL)
- [x] PWA: manifest.json + service worker
- [x] Cloudflare Web Analytics
- [x] About sheet + Suggestions sheet

---

## V2 (rama activa — v2.0)

### Rediseño visual implementado
- [x] Header/hero: nombre centrado, estrella favorito en topbar derecha
- [x] Selector de día: 3 tabs fijos (Hoy / Mañana / 7 días) en lugar de dropdown
- [x] Franjas: icono weather real del API + temperatura por franja
- [x] Sliding pill indicator animado en selector de franjas
- [x] Vista 7 días: placeholder vacío

### Pendiente en v2.0
- [ ] Vista 7 días con contenido real
- [ ] Token temporal en copy (ver estado-proyecto.md)
- [ ] Ilustraciones para todos los estados (faltan algunas)

---

## V3 (login + premium)

- [ ] Login opcional (magic link o Google/Apple)
- [ ] Sync de spots entre dispositivos
- [ ] Alertas de condiciones
- [ ] Previsión extendida (14 días)
- [ ] Widget de pantalla de inicio (iOS/Android)
- [ ] Historial de condiciones (últimos 7 días)

---

## Backlog / ideas sin priorizar

- Modo oscuro
- Notificación "esta tarde está bien para salir"
- Comparativa de spots cercanos
- Calendario de la semana (vista semanal)
- Integración con calendario del móvil
- B2B: dashboard para escuelas
- Spots comunitarios (usuarios comparten spots buenos)
