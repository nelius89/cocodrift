# COCODRIFT — RESULTS (v2)

## 1. Contexto

Este documento define la estructura, comportamiento y lógica de la pantalla de resultados (resolución) de Cocodrift.

El objetivo de esta pantalla es responder de forma clara y rápida a:
¿Está para salir?

Y permitir:
- entender condiciones actuales
- navegar entre días
- navegar entre franjas horarias
- profundizar en información técnica

---

## 2. Estructura general

La pantalla se divide en 2 bloques principales:

1. Header azul (contexto + navegación temporal)
2. Resultado (diagnóstico + explicación)

---

## 3. Header superior

### Estructura (misma línea horizontal)

- Izquierda:
  Botón volver
  Acción: regresar a Home

- Centro:
  Nombre de la playa (texto normal, no uppercase)
  Debe truncar si es largo

- Derecha:
  Botón favorito
  Acción:
    - marcar / desmarcar como favorita
    - impacta directamente en la Home

---

## 4. Línea de contexto

Debajo del header principal

Elementos en una misma línea:

1. Icono ubicación + ciudad
2. Separador
3. Icono viento + velocidad en km/h (NO nudos)
4. Separador
5. Icono clima + temperatura en °C

Notas:
- El viento enkm/h
- Icono clima usa sistema actual (weathercode)

---

## 5. Selector de fecha (expandible)

### Estado cerrado

Botón con:
- icono calendario
- texto con fecha concreta (ej: Lunes 20, Abril)
- icono desplegable

### Función

- Indica la fecha actualmente seleccionada
- Por defecto:
  HOY + franja actual

### Estado abierto

- Se despliega con animación vertical
- Muestra los próximos 6 días

### Comportamiento

- Click en día → actualiza datos
- Se cierra automáticamente

---

## 6. Selector de franjas horarias

### Definición (sistema)

Se definen 5 franjas:

1. Madrugada → 00:00 – 07:00  
2. Amanecer → 07:00 – 10:00  
3. Mediodía → 10:00 – 14:00  
4. Tarde → 14:00 – 19:00  
5. Noche → 19:00 – 00:00  

### UI

- Barra horizontal dentro del header azul
- Cada franja es un botón
- Siempre hay una seleccionada

### Estado activo

- La franja activa se muestra como una pastilla destacada
- Debajo aparece un indicador triangular
- Debajo del indicador aparece el rango horario exacto

Ejemplo:
16:00 — 21:00

### Estado inactivo

- No muestra rango horario

### Comportamiento

- Click en franja → actualiza datos

---

## 7. Bloque resultado

Separado visualmente del header azul

---

## 8. Presubtítulo

Texto fijo:

¿Está para salir?

---

## 9. Estados (título principal)

5 estados posibles:

1. Oh yeah, sin dudarlo
2. Sí, está muy agradable
3. Sí, está movido pero manejable
4. Depende, está exigente
5. Mejor quedarse en tierra

### Lógica

- Se basa en sistema de diagnóstico existente
- Solo cambia el copy visible

---

## 10. Ilustración

- SVG animado (3 frames)
- Color: azul corporativo

### Nota implementación

- Temporalmente usar la misma ilustración para todos los estados
- Más adelante se asignarán ilustraciones específicas por estado

---

## 11. Bloques explicativos (3)

### Estructura

3 bloques iguales:

- Fondo blanco
- Bordes redondeados
- Mismo ancho

Cada bloque contiene:

1. Icono (izquierda)
   - Dentro de un cuadrado azul
   - Icono en blanco
   - SVG fijo (definido en diseño)

2. Contenido (derecha)
   - Título
   - Subtítulo

### Tipos de bloques

Los 3 bloques representan:

1. Estado del mar  
2. Qué te va a exigir  
3. Para quién encaja  

### Lógica

- Los textos vienen del sistema de mensajes
- No son estáticos
- Dependen del estado calculado
- No se deben inventar textos fuera del sistema

---

## 12. CTA información detallada

Debajo de los 3 bloques

### Estructura

- Fondo negro
- Mismo ancho que bloques
- Bordes redondeados

Contenido:

- Texto: Info detallada
- Icono de navegación

### Comportamiento

- Click → abre sección de información técnica

---

## 13. Navegación

Flujo:

Home → Spot → Results

Dentro de Results:

- Cambio día → recalcula
- Cambio franja → recalcula
- Click info → detalle técnico

---

## 14. Notas de implementación

- Respetar diseño exacto de pantallazos
- No modificar lógica de diagnóstico
- Mantener coherencia visual con Home
- Animaciones suaves (expand/collapse)

