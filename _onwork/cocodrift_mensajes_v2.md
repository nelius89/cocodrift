
# Cocodrift — Sistema de Mensajes (v2)

## 1. Estados finales (hero)

### 1. Piscina
**¿Está para salir?**  
OH YEAH, SIN DUDARLO

### 2. Muy agradable
**¿Está para salir?**  
SÍ, ESTÁ MUY AGRADABLE

### 3. Se puede salir
**¿Está para salir?**  
SÍ, ESTÁ MOVIDO PERO MANEJABLE

### 4. Exigente
**¿Está para salir?**  
DEPENDE, ESTÁ EXIGENTE

### 5. No recomendable
**¿Está para salir?**  
MEJOR QUEDARSE EN TIERRA


---

## 2. Reglas de aparición de estados

El estado se calcula mediante `diagnosticar()` en base a:

- viento medio (windKn)
- rachas (gustKn)
- altura de ola (waveH)
- periodo (wavePer)
- dirección (terral)
- weathercode (tormenta)

### Jerarquía (simplificada)

- Tormenta → no recomendable
- Viento >20kn → no recomendable
- Ola >1.5m → no recomendable
- Terral fuerte + viento → no recomendable

- Viento >15kn → exigente
- Ola >1.0m → exigente
- Periodo corto (<4s) → exigente

- Viento >10kn → se puede salir
- Ola >0.6m → se puede salir

- Condiciones muy calmadas → piscina
- Resto → muy agradable


---

## 3. Nueva lógica de bloques (IMPORTANTE)

Los bloques NO son fijos por estado.

Se generan dinámicamente en función de las condiciones reales.

### Estructura

1. Bloque 1 → Qué te vas a encontrar  
2. Bloque 2 → Qué te va a pedir  
3. Bloque 3 → Para quién encaja  

El usuario NO ve estas etiquetas.  
Cada bloque debe ser autónomo y entendible sin contexto.


---

## 4. Construcción de bloques

### Bloque 1 — “Qué te vas a encontrar”

Depende de:
- ola (waveH)
- periodo (wavePer)
- estado del mar

Ejemplos:
- Mar plano → “El mar está como una piscina”
- Olas pequeñas → “Algo de movimiento, pero suave”
- Olas medias → “El mar tiene movimiento real”
- Caótico → “El mar está muy revuelto”


---

### Bloque 2 — “Qué te va a pedir”

Depende de:
- viento
- rachas
- variabilidad

Ejemplos:
- Bajo → “Remar está fácil y fluido”
- Medio → “Se rema cómodo, algo de viento”
- Alto → “Necesitarás mantener el equilibrio”
- Muy alto → “Remar se vuelve muy difícil”


---

### Bloque 3 — “Para quién encaja”

Depende de:
- estado
- warnings activos

Ejemplos:
- Piscina → “Es un día para cualquiera”
- Intermedio → “Mejor con algo de experiencia”
- Exigente → “Solo para gente con experiencia”
- No recomendable → “No es un día para salir”


---

## 5. Reglas clave de copy

- Cada bloque debe funcionar solo (sin contexto)
- No usar frases abstractas (“te va a pedir…”)
- Lenguaje directo y físico
- Describir experiencia, no datos
- Evitar redundancia entre bloques


---

## 6. Ejemplos completos (input → output)

### Caso 1 — Piscina

Input:
- viento: 4kn
- ola: 0.2m
- periodo: 8s

Output:

Bloque 1:
El mar está como una piscina  
Sin olas y sin apenas movimiento. Todo se siente estable.

Bloque 2:
Remar está fácil y fluido  
No hay resistencia ni esfuerzo extra. Puedes avanzar sin cansarte.

Bloque 3:
Es un día para cualquiera  
Da igual el nivel. Es perfecto incluso si es tu primera vez.


---

### Caso 2 — Muy agradable

Input:
- viento: 8kn
- ola: 0.4m

Output:

Bloque 1:
Algo de movimiento, pero suave  
Pequeñas olas y ritmo regular. Nada que sorprenda.

Bloque 2:
Se rema cómodo, algo de viento  
Lo notas, pero no molesta ni condiciona.

Bloque 3:
Apto para casi todos  
Si has salido alguna vez, lo vas a disfrutar sin problema.


---

### Caso 3 — Se puede salir

Input:
- viento: 11kn
- rachas: 18kn
- ola: 0.7m

Output:

Bloque 1:
El mar tiene movimiento real  
Olas medias y viento que cambia por momentos.

Bloque 2:
Necesitarás mantener el equilibrio  
Las rachas pueden descolocarte y remar ya exige esfuerzo.

Bloque 3:
Mejor con algo de experiencia  
Si ya controlas la tabla, es buen día. Si no, puede costar.


---

### Caso 4 — Exigente

Input:
- viento: 16kn
- ola: 1.1m
- periodo: 4s

Output:

Bloque 1:
Mar movido y poco ordenado  
Olas que no siguen un ritmo claro y viento incómodo.

Bloque 2:
Mantenerse de pie exige técnica  
El viento empuja y el mar no ayuda. No puedes relajarte.

Bloque 3:
Solo para gente con experiencia  
Si no tienes control, lo vas a pasar mal.


---

### Caso 5 — No recomendable

Input:
- viento: 22kn
- ola: 1.6m
- periodo: 3s

Output:

Bloque 1:
El mar está muy revuelto  
Olas grandes, cortas y desordenadas. Todo se mueve a la vez.

Bloque 2:
Remar se vuelve muy difícil  
El viento te frena o te arrastra, y mantener el equilibrio cuesta mucho.

Bloque 3:
No es un día para salir  
Las condiciones no son seguras, independientemente del nivel.


---

## 7. Implementación (resumen técnico)

Nueva función:

buildNarrativeBlocks(d, estado, warnings)

Debe devolver:

{
  encounter: { title, desc },
  demand: { title, desc },
  fit: { title, desc }
}

Integración en:

renderResults()

Reemplaza el sistema actual de bloques viento/mar por estos 3 bloques narrativos.


---

## 8. Principio clave

El estado responde:  
“¿Salgo o no?”

Los bloques explican:  
“Qué está pasando hoy exactamente”

---

## 9. Anotaciones

Adjunto pantallazos para que comprendas el output final.
