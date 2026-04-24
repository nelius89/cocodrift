# Backlog — Pendiente priorizado

_Actualizar regularmente. Las tareas de la fase activa van arriba._
_Última actualización: 2026-04-17_

---

## FASE 0 — Hacer ahora

- [ ] Añadir pantalla "Acerca de Coco" con disclaimer + atribuciones
- [ ] Ilustraciones para estados Aceptable, Complicado, No salir
- [ ] Renombrar app a "Coco" en title, metadatos, icono
- [ ] manifest.json para PWA
- [ ] Service worker básico para PWA
- [ ] Activar Cloudflare Web Analytics en el dashboard
- [ ] Redactar Privacy Policy (ver `legal/privacy-policy-draft.md`)
- [ ] Redactar Terms of Service (ver `legal/terms-draft.md`)
- [ ] Actualizar User-Agent de Nominatim a `'Coco App'`
- [ ] Icono de app: cocodrilo, todos los tamaños

---

## FASE 1 — Post-lanzamiento web

- [ ] Añadir enlace de feedback visible (email o formulario)
- [ ] Validar algoritmo de score con usuarios reales
- [ ] Ajustar calibración del score si hay discrepancias
- [ ] Analizar primeros datos de Cloudflare Analytics

---

## FASE 2 — Para stores

- [ ] Capacitor setup
- [ ] Testing en dispositivos físicos iOS y Android
- [ ] Screenshots de store (mínimo 3 por plataforma)
- [ ] Descripción de app en español e inglés
- [ ] Feature Graphic para Google Play (1024×500)
- [ ] Cloudflare Worker proxy (antes de submit)

---

## UX / ANIMACIONES

- **Transición btn-detail → info técnica (Opción D):** el propio botón negro hace `transform: scale(40)` hasta cubrir la pantalla — sin overlay separado, el botón literalmente se convierte en la página de info. Más satisfactorio que el crossfade actual (Opción B, implementada en v2.0). Requiere gestionar el z-index y el origen del transform desde la posición real del botón.

---

## BACKLOG SIN PRIORIZAR

- Ilustraciones adicionales (variantes de estados)
- Modo oscuro
- Widget de pantalla de inicio
- Deportes adicionales (surf, kayak)
- Geolocalización opcional
- Compartir condiciones
- Notificaciones push
- Login + sync
- Historial de condiciones
- Previsión extendida 14 días
- Calendario semanal de condiciones
- Spots comunitarios
