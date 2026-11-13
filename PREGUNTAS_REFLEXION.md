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

> If I omit the dependency array, the effect runs after every render. Since my effect updates state, it would cause a new render and run again, creating an infinite loop of requests.

2. **¿Qué significa dejar el arreglo vacío?**

> An empty array means the effect has no dependencies, so React runs it only once, right after the component mounts. It is the right choice for an initial data load.

3. **¿Por qué la función que recibe `useEffect` no debe ser `async` directamente?**

>> An `async` function always returns a promise, but React expects the effect to return nothing or a cleanup function. So I define an `async` function inside the effect and call it right away.

## Paso 5 · FlatList

1. **¿Para qué sirve la prop que extrae la llave de cada elemento?**

> The `keyExtractor` prop gives each item a unique and stable key, usually its `id`. React uses it to identify which items were added, removed or moved, so it can update the list efficiently and avoid warnings or rendering bugs.

2. **¿Por qué usar `FlatList` en lugar de un `ScrollView` con `.map()`?**

> `FlatList` renders only the items that are visible on screen (plus a few extra), while a `ScrollView` with `.map()` renders every item at once. With hundreds of characters, `FlatList` uses much less memory and is faster. It also gives built-in features such as pagination and pull to refresh.

## Paso 6 · Carga y error

**¿Por qué es mejor mostrar un mensaje con un botón "Reintentar" que dejar la pantalla vacía?**

> An empty screen gives no information, so the user cannot tell if the app is broken, loading or has no data. A clear message explains what happened, and the "Retry" button lets the user fix the problem (for example after reconnecting) without restarting the app. 

## Paso 8 · Paginación

**¿Qué problema aparece si la función de "cargar más" se dispara varias veces seguidas? ¿Cómo lo evité?**

> If "load more" fires several times in a row, the app can request the same page more than once, which creates duplicated characters and duplicated keys, and the API can answer with a 429 (too many requests). I avoided it by returning early when it is already loading, using a `useRef` flag that changes immediately (state updates are asynchronous), or when the API says there is no next page. 

## Paso 9 · Pull to refresh

**¿Por qué usé un estado distinto (`refreshing`) y no el mismo de la carga inicial?**

> The initial load replaces the whole screen with a spinner, while a refresh should keep the list visible and only show the native pull indicator at the top. With a separate `refreshing` state the screen does not flash a full loader, and `FlatList` can control its own refresh indicator through the `refreshing` prop. 

## Paso 10 · Búsqueda

1. **¿Qué es el debounce y qué problema resuelve?**

> Debounce means waiting until the user stops typing for a short time before running an action. It solves the problem of sending one request for every keystroke, which wastes network calls and can overload the API. 

2. **¿Para qué sirve la función de limpieza (cleanup) que se devuelve en un `useEffect`? Da un ejemplo de esta práctica.**

> The cleanup function runs before the effect runs again and when the component unmounts. It is used to undo what the effect started. In this practice, I use `clearTimeout` in the debounce effect so the previous timer is cancelled while the user keeps typing, and an `ignore` flag in the loading effect to discard old responses. 

3. **Si el usuario escribe rápido y las respuestas llegan en desorden, ¿qué podría salir mal?**

> An old, slow response could arrive after a newer one and overwrite it, so the screen would show results for a search the user is no longer looking for (for example, "ric" results while the input says "rick"). I avoid it with the `ignore` flag set in the cleanup function. 

## Cierre

**Menciona dos mejoras que le harías a la app si tuvieras una hora más:**

> 1) I would use `AbortController` to really cancel the previous request when the search changes, instead of only ignoring its response. 2) I would show the characters in a two-column grid and wrap `CharacterCard` with `React.memo`, so the list looks better and avoids unnecessary re-renders.