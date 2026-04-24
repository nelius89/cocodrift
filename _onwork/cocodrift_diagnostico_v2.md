# COCODRIFT — DIAGNÓSTICO DE DESAJUSTES (v2)

## 1. Contexto

Este documento recoge el diagnóstico de diferencias entre:

- Sistema actual (sistema-diagnostico.md)
- Sistema de mensajes v2 (cocodrift_mensajes_v2.md)
- Nuevos documentos de diseño (Home, Results, Info técnica)

El objetivo es identificar desajustes sin proponer soluciones, para poder actualizar el sistema de forma coherente.

---

## 2. Desajustes críticos

### 2.1 Generación de bloques narrativos

El sistema actual genera piezas separadas:
- viento (windTitle, windDesc)
- mar (seaTitle, seaDesc)
- userFit

La nueva estructura requiere:
- 3 bloques narrativos unificados:
  1. Qué te vas a encontrar
  2. Qué te va a exigir
  3. Para quién encaja

Desajuste:
El sistema no genera estos bloques como entidad estructural única.

---

### 2.2 Sistema de warnings vs representación UI

El sistema trabaja con:
- warnings con categorías: narrativa, a-tener-en-cuenta, cuidado, alerta

La UI trabaja con:
- bloque rojo (alerta real)
- bloque azul (información contextual)

Desajuste:
No existe correspondencia directa entre categorías del sistema y bloques visuales.

---

### 2.3 Terral sin jerarquía propia

En el sistema:
- el terral es un warning más

En la UI:
- tiene bloque propio
- prioridad máxima
- comportamiento diferenciado

Desajuste:
El sistema no contempla jerarquía especial para terral.

---

### 2.4 Falta de agrupación de avisos

En el sistema:
- warnings es una lista plana

En la UI:
- existe un bloque único “A tener en cuenta” que agrupa múltiples avisos

Desajuste:
Falta lógica de agrupación previa a render.

---

### 2.5 Estructura de información técnica no alineada

En el sistema:
- buildTechBlocks devuelve texto completo por métrica

En la UI:
- cada bloque técnico tiene 3 niveles:
  1. Qué significa (fijo)
  2. Qué implica hoy (dinámico)
  3. Clave (interpretación)

Desajuste:
El sistema no separa estas capas de contenido.

---

### 2.6 Existencia de lógica narrativa obsoleta

El sistema incluye:
- cierres narrativos (closing)

La UI actual:
- no utiliza este elemento

Desajuste:
Existe lógica que ya no tiene representación en interfaz.

---

### 2.7 Estados con copy desactualizado

En el sistema:
- textos de estado distintos

En mensajes v2:
- nuevos copies definidos

Desajuste:
La lógica de estado es válida, pero el copy no está sincronizado.

---

### 2.8 Falta de jerarquía de render

La UI establece un orden claro:

1. Aviso terral
2. A tener en cuenta
3. Información técnica

El sistema:
- no define orden visual
- solo devuelve datos

Desajuste:
Falta capa de priorización para render.

---

### 2.9 Mezcla de capas conceptuales

El sistema mezcla:
- experiencia (narrativa)
- explicación (técnica)

La UI:
- separa claramente ambas capas

Desajuste:
Falta separación conceptual clara en el sistema.

---

### 2.10 Franjas horarias incompatibles

Sistema:
- 7 franjas (api.js)

Nueva definición:
- 5 franjas:
  - madrugada
  - amanecer
  - mediodía
  - tarde
  - noche

Desajuste:
Incompatibilidad directa que afecta al cálculo de datos.

---

### 2.11 Falta de función narrativa unificada

Mensajes v2 define:
- buildNarrativeBlocks(d, estado, warnings)

El sistema actual:
- no implementa esta función

Desajuste:
Falta punto central de construcción narrativa.

---

### 2.12 Falta de diferenciación de niveles de impacto

El sistema maneja niveles pero no diferencia claramente:

- peligro real
- incomodidad
- contexto

La UI sí lo hace explícitamente.

Desajuste:
Falta alineación conceptual entre sistema y experiencia.

---

## 3. Desajustes medios

### 3.1 Dirección del viento

Sistema:
- devuelve dirección cardinal

UI:
- requiere representación visual (brújula)

Desajuste:
Falta capa de transformación visual.

---

### 3.2 Labels técnicos vs experiencia

Sistema:
- usa etiquetas técnicas (ej. “brisa ligera”)

UI:
- no siempre utiliza estos labels

Desajuste:
Posible incoherencia futura de lenguaje.

---

### 3.3 Uso de weathercode

Sistema:
- uso limitado (tormenta)

UI:
- representación visual del clima en header

Desajuste:
Infrautilización del dato.

---

## 4. Elementos alineados

Los siguientes aspectos están correctamente alineados:

- Modelo de diagnóstico por variables
- Variables clave (viento, rachas, ola, periodo)
- Lógica de estados
- Filosofía narrativa general
- Base técnica del sistema

---

## 5. Conclusión

El sistema actual es funcional pero corresponde a una versión conceptual anterior.

La UI y los mensajes v2 introducen:
- nueva estructura narrativa
- nueva jerarquía visual
- nueva separación de capas (experiencia vs técnica)

El principal problema no es de lógica base, sino de:
- estructura
- representación
- alineación semántica

Este documento identifica los puntos que deben revisarse antes de actualizar el sistema a v2.
