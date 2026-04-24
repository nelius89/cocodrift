# COCODRIFT — HOME (v2)

## 1. Contexto general

Este documento define la estructura, comportamiento y lógica de la Home de Cocodrift tras los últimos ajustes de diseño y UX.

Debe leerse como una actualización sobre lo ya implementado. No sustituye el sistema existente, sino que introduce cambios concretos sobre:
- entrada inicial (first-time user)
- estado con playas guardadas
- navegación principal desde Home
- sustitución del menú hamburguesa por accesos directos
- cambio de botón “+” a búsqueda

El objetivo es simplificar la entrada, mejorar la claridad de uso y alinear la Home con el comportamiento real del usuario.

---

## 2. Estructura general de la Home

La Home se compone de 3 bloques principales:

1. Header (acciones globales)
2. Hero (animación Cocodrift)
3. Zona inferior (contenido dinámico según estado del usuario)

---

## 3. Header (actualización clave)

### Cambios estructurales

- Se elimina completamente el menú hamburguesa
- Se reemplaza por dos acciones directas visibles

### Elementos

Posición: esquina superior derecha (fixed)

Botones:

1. Botón información
   - Icono: info
   - Acción: abre About Sheet

2. Botón contacto
   - Icono: mensaje / feedback
   - Acción: abre Suggestions Sheet

---

## 4. Hero (sin cambios)

- Ilustración Cocodrift animada (sprite PNG 3 frames)
- Ya implementado

---

## 5. Estados de la Home

A. First-time user  
B. Usuario con playas guardadas

---

## 6. Estado A — First-time user

Botón principal:
BUSCA TU PLAYA FAVORITA + icono lupa

Texto:
Y te cuento si está para salir con la tabla

Acción:
Click → Search Screen → Results

---

## 7. Estado B — Usuario con playas guardadas

Lista de spots:

Cada fila:
- Abreviatura ciudad (3 letras)
- Botón con nombre de playa
- Última fila incluye botón búsqueda

Formato nombre:
- Platja de X / Playa de X

---

## 7.2 Botón búsqueda

- Sustituye al botón "+"
- Icono: lupa
- Forma: circular
- Outline igual que spots

Diferencia:
- Opacidad reducida respecto a los spots

Objetivo:
- Acción secundaria visual

---

## 8. Search Screen

Sin cambios

---

## 9. Navegación

First-time:
Home → Search → Results

Usuario:
Home → Spot → Results
Home → Buscar → Search → Add → Home

---

## 10. Lógica

- LocalStorage
- Máx 10 spots
- Sin cambios

---

## 11. Decisiones UX

- Eliminación hamburguesa
- Buscar como acción principal
- Jerarquía visual clara
- Reducción de ruido

---

## 12. Implementación

Modificar solo:
- Header
- Estado A
- Estado B
- Botón búsqueda
