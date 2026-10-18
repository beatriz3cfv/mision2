# Personajes de Harry Potter

Misión M2 · Async Odyssey — Web Development I. \
[API de Harry Potter](https://hp-api.onrender.com)

## Cómo probarlo
```bash
npm install
npm run dev
```

Escribe el nombre de un personaje (por ejemplo "Weasley" o "Harry") o una casa (Gryffindor, Slytherin, Ravenclaw, Hufflepuff) y pulsa «Buscar» o Enter. También puedes pulsar los botones de casa, que muestran cuántos personajes hay en cada una, y combinarlos con el texto. Al hacer click en un personaje se abre una tarjeta con toda su información (se cierra con la X, con click fuera o con Esc).

## Uso de IA
Usé Gemini para ayudarme a estructurar el JavaScript en distintos ficheros y a importar las funciones. También para la ventana modal: al hacer click en un personaje se muestran todos sus datos, creando en `renderModal(char)` la tarjeta.

Después usé Claude para revisar el proyecto y aplicar mejoras: loading real y buscador desactivado hasta tener datos, eliminar el `setTimeout` artificial, escapar el HTML de la API, delegación de eventos, caché y filtros con `reduce`. He revisado el código resultante y sé explicar cada parte.

## Autopsia
1. Guardo todos los personajes de la API en `state.all` tras la carga inicial (`async/await`), así no hay peticiones repetidas en cada búsqueda. Los datos crudos (`state.all`) están separados de lo que se muestra (`state.visible`), que se calcula con `filterCharacters` + `formatCharacter`.

2. Uso un único listener de `click` en `document` (delegación de eventos). Cada elemento indica su acción con `data-action` (`search`, `open-character`, `toggle-house`, `close-modal`, `retry`). Como las tarjetas se vuelven a crear en cada búsqueda, un listener por tarjeta se perdería y habría que reenganchar; con la delegación no.

3. Todo lo que viene de la API pasa por `escapeHTML` antes de entrar en un `innerHTML`, para que un dato con `<` o comillas no rompa la página ni inyecte HTML.