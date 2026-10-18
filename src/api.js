const API_URL = 'https://hp-api.onrender.com/api/characters';

// Sacar todos los personajes
// Cualquier fallo acaba como Error que se enseña en main con RenderError
export async function fetchCharacters() {
    let response;
    try {
        response = await fetch(API_URL);

    } catch (error) {
        throw new Error(error.message || 'Error de conexión con la red, no se pudo conectar con la API.');
    }

    if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.status} ${response.statusText}`);
    }
        
    const data = await response.json().catch(() => null);
    if (!Array.isArray(data)) {
        throw new Error('Error de formato.');
    }
    return data;
}
