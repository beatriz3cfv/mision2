const API_URL = 'https://hp-api.onrender.com/api/characters';

// Sacar todos los personajes
export async function fetchCharacters() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;

    } catch (error) {
        throw new Error(error.message || 'Error de conexión con la red.');
    }
}
