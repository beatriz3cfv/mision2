// Transformaciones map/filter/reduce

// 1. Filtrar solo las obras con imagen
export function filterValidArtworks(artworks) {
    return artworks.filter(item => item.image_id !== null && item.image_id !== undefined);
}

// URL de imagen IIIF con el ancho que queramos
function buildImageUrl(imageBaseUrl, imageId, width) {
    return `${imageBaseUrl}/${imageId}/full/${width},/0/default.jpg`;
}

// Separar nombre y el resto
function splitArtist(artistDisplay) {
    const [name, ...rest] = (artistDisplay || '').split('\n');

    return { name: name.trim() || 'Artista desconocido', extra: rest.join(' · ').trim() };
}

// de html a txt
export function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
        .replace(/&#0?39;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

// 2. Transformar los datos para facilitar el diseño
export function formatArtwork(artworks, imageBaseUrl) {
    return artworks.map(item => ({
        id: item.id,
        title: item.title || 'Título desconocido',
        artist: splitArtist(item.artist_display).name,
        year: item.date_display || 'Fecha no disponible',
        type: item.artwork_type_title || 'Obra de arte',
        medium: item.medium_display || '',
        origin: item.place_of_origin || '',
        imageUrl: buildImageUrl(imageBaseUrl, item.image_id, 400)
    }));
}

// 3. Transformar la ficha completa de una obra
export function formatArtworkDetail(item, imageBaseUrl) {
    const artist = splitArtist(item.artist_display);

    return {
        id: item.id,
        title: item.title || 'Título desconocido',
        artist: artist.name,
        artistExtra: artist.extra,
        year: item.date_display || '',
        type: item.artwork_type_title || '',
        medium: item.medium_display || '',
        origin: item.place_of_origin || '',
        dimensions: item.dimensions || '',
        style: item.style_title || '',
        credit: item.credit_line || '',
        publicDomain: Boolean(item.is_public_domain),
        description: stripHtml(item.description) || stripHtml(item.short_description),
        // Algunas obras no tienen imagen
        imageUrl: item.image_id ? buildImageUrl(imageBaseUrl, item.image_id, 843) : null
    };
}
