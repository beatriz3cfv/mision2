# Personajes de Harry Potter

Misión M2 · Async Odyssey — Web Development I.

## Cómo probarlo
Abre el proyecto con Vite (npm run dev) o abre el archivo de construcción en el navegador. Escribe el nombre de un personaje de Harry Potter (por ejemplo, "Weasley" o "Harry") en el buscador y pulsa «Buscar» o la tecla Enter. El buscador funciona para el nombre del personaje y la casa (Gryffindor, Slytherin, Ravenclaw o Hufflepuf). Por ejemplo:
- Si buscas 'Gryffindor', saldrán todos los personajes de esa casa.
La razón por la que se filtra solo por esos parámetros es que si no hay demasiadas coincidencias, es decir, si añadimos al filtro el nombre del actor, la varita, el patronus... Al buscar salen
demasiadas coincidencias, y se pierde un poco el sentido de buscar y encontrar. Por otro lado, se puede hacer click en un personaje y saldrá una tarjeta centrada en el personaje con toda su información disponible.

## Uso de IA
Usé Gemini para ayudarme a estructurar todo el JavaScript en distintos ficheros y cómo importar las funciones. También para la ventana modal, ya que al hacer click en un personaje, se buscan todos los datos disponibles de dicho personaje, creando en `renderModal(char)` el div de la tarjeta. Además bloquea el resto para que el usuario solo pueda interactuar con la ventana (en botón X para cerrar).

## Autopsia
1. Guardo todos los personajes obtenidos de la API en una variable global del módulo tras la carga inicial (`async/await`), evitando realizar peticiones repetidas de red en cada consulta y optimizando el rendimiento de la interfaz. La fuente de verdad de los datos crudos está desacoplada de la renderización del DOM.

2. Uso un solo listener dinámico acoplado a las tarjetas tras su renderizado (y delegación de eventos en el modal) en vez de múltiples escuchas dispersas. Esto simplifica la gestión del flujo asíncrono y previene problemas de duplicidad de eventos al actualizar los resultados de la búsqueda.