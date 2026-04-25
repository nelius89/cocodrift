# Principios de diseño — Coco

_Última actualización: 2026-04-17_

---

## Los 5 principios que no se negocian

### 1. Claridad antes que datos
El usuario no necesita todos los datos — necesita la respuesta correcta. Cada elemento de la interfaz debe servir a la comprensión, no a la exhaustividad.

**En la práctica:** Si hay que elegir entre mostrar más información o menos información más clara, siempre menos y más clara.

---

### 2. Lenguaje de amigo, no de app
Coco habla como lo haría un amigo que sabe de surf. Directo, sin tecnicismos, con algo de humor cuando procede. Nunca condescendiente, nunca corporativo.

**En la práctica:**
- "¡Como si estuvieras en la piscina!" en vez de "Condiciones óptimas"
- "Hoy playa, pero sin tabla" en vez de "Condiciones desfavorables"
- El tono siempre acompaña la situación — no es gracioso cuando hay riesgo real

---

### 3. Personalidad visual clara
Coco tiene colores, tiene mascota, tiene carácter. No es una app blanca y gris. La personalidad visual no es decoración — es parte de la propuesta de valor.

**En la práctica:**
- Color como elemento de comunicación (no solo estética)
- Ilustraciones con expresividad propia
- Diseño minimalista pero no frío

---

### 4. Mobile first, sin concesiones
El 100% de los usuarios usarán la app en el móvil, en la playa o antes de salir. El diseño debe funcionar perfectamente con una mano, con el sol dando en la pantalla, en segundos.

**En la práctica:**
- Touch targets mínimo 44px
- Información más importante en el tercio superior de la pantalla
- Sin acciones importantes que requieran scroll

---

### 5. Seguridad sin alarmar innecesariamente
El aviso de terral y los estados de riesgo son parte del valor de la app — no son alertas molestas. Deben ser claros y accionables, nunca alarmistas cuando no hace falta.

**En la práctica:**
- El aviso de terral existe y se ve, pero no interrumpe el diagnóstico principal
- El nivel de urgencia visual debe coincidir con el nivel de riesgo real
- Nunca "wolf crying" — si todo da alarma, nada da alarma

---

## Estado del diseño actual

El diseño actual respeta los principios 1, 2 y 4 bien. El principio 3 (personalidad visual, color) está en desarrollo — la paleta actual es azul/beige, funcional pero con potencial de más carácter. El principio 5 está implementado con el sistema de terral.

---

## Decisiones de diseño existentes

- **Tipografía:** Geist Mono — técnica pero accesible, da carácter sin ser ruidosa
- **Paleta base:** `#314fff` (azul) + `#f9f6ef` (beige) + `#0a0a0a` (negro)
- **Ilustraciones:** PNG con fondo transparente, sin contenedor circular
- **Métricas:** Tech blocks inline (viento + oleaje) en zona scrollable — sin slides
- **Terral:** Info sheet por métrica (bottom sheet) — no rompe el layout principal
- **Animaciones:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)` como curva estándar de transición
