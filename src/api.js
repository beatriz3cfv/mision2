const API_URL = 'https://hp-api.onrender.com/api/characters';

// Pide todos los personajes a la API.
// Cada fallo posible (red, servidor, formato) acaba como un Error con un mensaje
// pensado para el usuario, que main.js muestra con renderError.
export async function fetchCharacters() {
    let response;
    try {
        response = await fetch(API_URL);
    } catch {
        // fetch solo rechaza la promesa cuando no hay conexión (o CORS/DNS)
        throw new Error('No se pudo conectar con la API. Revisa tu conexión e inténtalo de nuevo.');
    }

    // fetch NO lanza error con un 404 o 500, hay que comprobarlo a mano
    if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.status} ${response.statusText}`.trim());
    }

    const data = await response.json().catch(() => null);
    if (!Array.isArray(data)) {
        throw new Error('La API devolvió un formato inesperado.');
    }
    return data;
}
