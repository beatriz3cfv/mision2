// Encargado de llamadas fetch

const BASE_URL = 'https://api.artic.edu/api/v1/artworks';
const DEFAULT_IMAGE_BASE = 'https://www.artic.edu/iiif/2';

// Campos para las tarjetas de la lista
const LIST_FIELDS = ['id', 'title', 'artist_display', 'date_display', 'image_id', 'artwork_type_title', 'medium_display', 'place_of_origin'].join(',');
// Campos extra al seleccionar una obra
const EXTRA_FIELDS = [LIST_FIELDS, 'department_title', 'dimensions', 'credit_line', 'style_title', 'description', 'short_description', 'is_public_domain'].join(',');

// Fetch general, valida HTTP y devuelve json
async function fetchJson(url, signal) {
    const response = await fetch(url, { signal });

    if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.status}`);
    }
    return response.json();
}

// Busca las obras
export async function fetchArtworks(searchQuery = '', signal) {
    try {
        // Si hay búsqueda, usamos ?q= para filtrar de forma global
        const endpoint = searchQuery ? `${BASE_URL}/search?q=${encodeURIComponent(searchQuery)}&` : `${BASE_URL}?`;

        const data = await fetchJson(`${endpoint}fields=${LIST_FIELDS}&limit=20`, signal);
        
        return { artworks: data.data || [], imageBaseUrl: data.config?.iiif_url || DEFAULT_IMAGE_BASE };
    
    } catch (error) {
        console.error("Error al obtener las obras: ", error);
        throw error; // Lo volvemos a lanzar para ui.js
    }
}

// Ficha completa de la obra
export async function fetchArtworkDetail(id, signal) {
    const data = await fetchJson(`${BASE_URL}/${encodeURIComponent(id)}?fields=${DETAIL_FIELDS}`, signal);

    return { artworks: data.data || [], imageBaseUrl: data.config?.iiif_url || DEFAULT_IMAGE_BASE };
}
