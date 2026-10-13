# Async Odyssey - Personajes de Harry Potter

Misión M2 · Async Odyssey — Web Development I.

## Cómo probarlo
Abre el proyecto con Vite (npm run dev) o abre el archivo de construcción en el navegador. Escribe el nombre de un personaje de Harry Potter (por ejemplo, "Weasley" o "Harry") en el buscador y pulsa «Buscar» o la tecla Enter.

## Uso de IA
Usé Gemini

## Autopsia
1. Guardo todos los personajes obtenidos de la API en una variable global del módulo tras la carga inicial (`async/await`), evitando realizar peticiones repetidas de red en cada consulta y optimizando el rendimiento de la interfaz. La fuente de verdad de los datos crudos está desacoplada de la renderización del DOM.

2. Uso un solo listener dinámico acoplado a las tarjetas tras su renderizado (y delegación de eventos en el modal) en vez de múltiples escuchas dispersas. Esto simplifica la gestión del flujo asíncrono y previene problemas de duplicidad de eventos al actualizar los resultados de la búsqueda.