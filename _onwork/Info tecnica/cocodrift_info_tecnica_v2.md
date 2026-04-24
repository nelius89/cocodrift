# COCODRIFT — INFO TÉCNICA (v2)

## 1. Contexto

Este documento define la estructura, comportamiento y jerarquía de la sección de información técnica de Cocodrift.

El objetivo es:
- explicar las condiciones reales del mar
- ayudar a interpretar los datos
- complementar el diagnóstico principal

Este documento NO define la lógica del sistema (diagnóstico, terral, avisos, etc.), solo cómo se representa.

---

## 2. Estructura general

La sección se compone de:

1. Aviso terral (rojo) — opcional
2. A tener en cuenta (azul) — opcional
3. Bloques técnicos (viento + ola) — siempre visibles
4. Nota informativa inferior

---

## 3. Orden de aparición (prioridad)

El orden es fijo y obligatorio:

1. Aviso terral (si existe)
2. A tener en cuenta (si existe)
3. Viento (siempre)
4. Ola (siempre)
5. Nota inferior

---

## 4. Aviso viento terral (bloque rojo)

### Aparición

- Solo aparece cuando existe aviso de terral relevante
- La lógica viene del sistema de diagnóstico (no definida aquí)

### Estructura

- Fondo negro
- Outline rojo
- Icono alerta rojo (con símbolo blanco)
- Título en rojo
- Texto en blanco

### Contenido

1. Título:
   AVISO VIENTO TERRAL

2. Explicación:
   2 líneas explicando qué ocurre

3. Conclusión:
   1 línea en negrita con recomendación clara

### Objetivo

- Señalar riesgo real
- Prioridad máxima en pantalla

---

## 5. Bloque “A tener en cuenta” (azul)

### Aparición

- Solo aparece si existen avisos informativos
- Estos avisos provienen del sistema (warnings)
- No implican peligro, solo contexto

### Estructura

- Fondo negro
- Outline azul
- Título: A TENER EN CUENTA
- Icono de información (círculo azul a la derecha)

### Contenido

Lista de items (1 o más):

Cada item incluye:
- Icono (viento o mar)
- Título
- Descripción (máx 2 líneas)

### Objetivo

- Ajustar expectativas
- Informar sin alarmar

---

## 6. Bloques técnicos (siempre visibles)

Dos bloques:

1. VIENTO
2. OLA

Ambos:
- Aparecen siempre
- Están plegados por defecto
- Son desplegables

---

## 7. Bloque VIENTO

### Estado plegado

Muestra:

- Dirección (ej: S)
- Tipo (ej: Cross-shore)
- Viento medio (kn)
- Rachas (kn)
- Brújula visual indicando dirección

### Nota

- La brújula debe contemplarse como elemento potencialmente animable
- En v1 puede ser estática

---

### CTA

- Texto: Entender el viento
- Icono: interrogación
- Acción: desplegar bloque

---

### Estado desplegado

Contiene 3 subbloques:

1. ¿Qué significa?
   - Contenido fijo (educativo)
   - Explica rangos de viento y su impacto

2. ¿Qué implica hoy?
   - Contenido dinámico
   - Describe cómo afectan los valores actuales

3. Clave
   - Interpretación final
   - Insight práctico

---

## 8. Bloque OLA

### Estado plegado

Muestra:

- Altura (m)
- Período (s)
- Representación visual de ola

---

### CTA

- Texto: Entender la ola
- Icono: interrogación
- Acción: desplegar bloque

---

### Estado desplegado

Contiene 3 subbloques:

1. ¿Qué significa?
   - Explica rangos de altura y periodo

2. ¿Qué implica hoy?
   - Describe condiciones actuales

3. Clave
   - Interpretación final del estado del mar

---

## 9. Nota inferior

Texto fijo:

Los valores son medias de la franja seleccionada.  
Toca cada bloque para entender mejor cómo leerlos.

---

## 10. Notas de implementación

- Respetar diseño visual del pantallazo
- No modificar lógica del sistema
- No inventar textos fuera del sistema de mensajes
- Mantener coherencia con bloques de resultado

---

## 11. Notas de layout (importante)

- El diseño actual está demasiado comprimido
- Es obligatorio mejorar:
  - espaciados verticales
  - márgenes entre bloques
  - separación entre elementos internos

Objetivo:
- mayor legibilidad
- mejor jerarquía visual
