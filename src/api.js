// Encargado de llamadas fetch

const BASE_URL = 'https://api.artic.edu/api/v1/artworks';

export async function fetchArtworks(searchQuery = '') {
    try {
        // Si hay texto de búsqueda, usamos el endpoint de search
        const url = searchQuery
            ? `${BASE_URL}/search?q=${encodeURIComponent(searchQuery)}&fields=id,title,artist_display,date_display,image_id,artwork_type_title`
            : `${BASE_URL}?fields=id,title,artist_display,date_display,image_id,artwork_type_title`;

        const response = await fetch(url);

        // Validación de HTTP
        if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status}`);
        }

        const data = await response.json();

        return { artworks: data.data, imageBaseUrl: data.config.iiif_url };
    
    } catch (error) {
        console.error("Error al obtener las obras: ", error);
        throw error; // Lo volvemos a lanzar para ui.js
    }
}
