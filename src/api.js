const API_URL = 'https://hp-api.onrender.com/api/characters';

// Saca todos los personajes, si hay error sale en main con RenderError
export async function fetchCharacters() {
    let response;
    try {
        response = await fetch(API_URL);
    } catch {
        // Solo cuando la promesa cuando no hay conexión
        throw new Error('No se pudo conectar con la API.');
    }

    if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.status} ${response.statusText}`.trim());
    }

    const data = await response.json().catch(() => null);
    if (!Array.isArray(data)) {
        throw new Error('La API devolvió un formato inesperado.');
    }
    return data;
}
