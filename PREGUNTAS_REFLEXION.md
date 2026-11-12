# Preguntas de reflexión

_Escribe tus respuestas debajo de cada pregunta._

**Alumno:** Marisol Reyes

---

## Paso 1 · Explorando la API

| Pregunta | Mi respuesta |
|---|---|
| ¿Cuántos personajes trae cada página? | 20 characters per page. |
| ¿Qué campo me dice si existe una página siguiente? | `info.next`, which contains the URL of the next page. |
| ¿Qué valor tiene ese campo en la última página? | `null`. |
| ¿Qué código HTTP devuelve una búsqueda sin resultados? | 404 (with the body `{"error":"There is nothing here"}`). |
| ¿Qué campos del personaje usa `CharacterCard`? | `name`, `status`, `species` and `image`. |

## Paso 2 · Petición HTTP

**¿Qué diferencia hay entre que `fetch` "falle" y que el servidor responda con un error? ¿Qué debo revisar en la respuesta?**

> A `fetch` failure happens only when the request cannot be completed, for example when there is no network, and then the promise is rejected. If the server responds with an error such as 404 or 500, `fetch` does not fail, so I have to check `response.ok` or `response.status` to know if the request was successful.

## Paso 3 · Estado

**¿Por qué guardo los personajes en estado y no en una variable normal?**

> If I stored the characters in a normal variable, React would not know it changed, so the screen would not re-render and the new data would not appear. Also, a normal variable is reset on every render. State keeps its value between renders and triggers a re-render when it is updated.

## Paso 4 · useEffect

1. **¿Qué pasa si omito por completo el arreglo de dependencias?**

> 

2. **¿Qué significa dejar el arreglo vacío?**

> 

3. **¿Por qué la función que recibe `useEffect` no debe ser `async` directamente?**

> 

## Paso 5 · FlatList

1. **¿Para qué sirve la prop que extrae la llave de cada elemento?**

> 

2. **¿Por qué usar `FlatList` en lugar de un `ScrollView` con `.map()`?**

> 

## Paso 6 · Carga y error

**¿Por qué es mejor mostrar un mensaje con un botón "Reintentar" que dejar la pantalla vacía?**

> 

## Paso 8 · Paginación

**¿Qué problema aparece si la función de "cargar más" se dispara varias veces seguidas? ¿Cómo lo evité?**

> 

## Paso 9 · Pull to refresh

**¿Por qué usé un estado distinto (`refreshing`) y no el mismo de la carga inicial?**

> 

## Paso 10 · Búsqueda

1. **¿Qué es el debounce y qué problema resuelve?**

> 

2. **¿Para qué sirve la función de limpieza (cleanup) que se devuelve en un `useEffect`? Da un ejemplo de esta práctica.**

> 

3. **Si el usuario escribe rápido y las respuestas llegan en desorden, ¿qué podría salir mal?**

> 

## Cierre

**Menciona dos mejoras que le harías a la app si tuvieras una hora más:**

>