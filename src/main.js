// Punto de entrada principal
import { fetchArtworks, fetchArtworkDetail } from "./api";
import { filterValidArtworks, formatArtwork, formatArtworkDetail } from "./logic";
import { renderLoading, renderError, renderArtwork, initModal, renderDetailLoading, renderDetailError, renderDetail } from "./ui";

// Controlador para peticiones innecesarias
let listController = null;
let detailController = null;

async function loadArtworks(query = '') {
    // Parar la petición anterior, si hubiera
    if (listController) listController.abort();
    listController = new AbortController();
    const { signal } = listController;

    try {
        // 1. Estado de carga
        renderLoading();

        // 2. Fetch de datos
        const {artworks, imageBaseUrl } = await fetchArtworks(query, signal);

        // 3. Transformación de datos
        const validArtworks = filterValidArtworks(artworks);
        const formattedData = formatArtwork(validArtworks, imageBaseUrl);

        // 4. Render en el DOM
        renderArtwork(formattedData);
    
    } catch (error) {
        // Petición cancelado aposta no cuenta
        if (error.name === 'AbortError') return;
        // 5. Estado de error
        renderError(error.message);
    }
}

async function showArtworkDetail(id) {
    if (detailController) detailController.abort();
    detailController = new AbortController();
    const { signal } = detailController;

    try {
        renderDetailLoading();
        const { artwork, imageBaseUrl } = await fetchArtworkDetail(id, signal);
        renderDetail(formatArtworkDetail(artwork, imageBaseUrl));
    
    } catch (error) {
        if (error.name === 'AbortError') return;
        renderDetailError(error.message);
    }
}

// Evento de búsqueda
document.addEventListener('DOMContentLoaded', () => {
    // Modal de detalle: al cerrarlo cancelamos la petición pendiente
    initModal(() => {
        if (detailController) detailController.abort();
    });

    // Carga por defecto
    loadArtworks();

    const searchInput = document.querySelector('#search-input');
    const searchButton = document.querySelector('#search-btn');
    const appDiv = document.querySelector('#app');

    // Dispara la búsqueda
    const handleSearch = () => {
        const query = searchInput.value.trim();
        loadArtworks(query);
    };

    // Clic en buscar
    searchButton.addEventListener('click', handleSearch);

    // Enter en el input
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

    // Clic (o Enter) en una tarjeta -> abrir su ficha
    appDiv.addEventListener('click', (event) => {
        const card = event.target.closest('.art-card');
        if (card) showArtworkDetail(card.dataset.id);
    });

    appDiv.addEventListener('keydown', (event) => {
        const card = event.target.closest('.art-card');
        if (card && event.key === 'Enter') showArtworkDetail(card.dataset.id);
    });
});
