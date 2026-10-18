import './styles.css';
import { fetchCharacters } from './api.js';
import { readCache, writeCache } from './cache.js';
import { filterCharacters, formatCharacter, countByHouse } from './logic.js';
import * as ui from './ui.js';

const state = {
    all: [],        // personajes crudos de la API
    counts: {},     // { casa: n de personajes }
    visible: [],    // resultados actuales, ya formateados
    house: null,    // casa seleccionada en los filtros
};

// Caché; si no hay, se pide a la API y se guarda
async function loadCharacters() {
    const cached = readCache();
    if (cached) return cached;

    const fresh = await fetchCharacters();
    writeCache(fresh);
    return fresh;
}

async function initApp() {
    // no se puede buscar sin datos
    ui.setControlsEnabled(false);   
    ui.renderLoading();

    try {
        state.all = await loadCharacters();
        state.counts = countByHouse(state.all);
        ui.renderHouseFilters(state.counts, state.house);
        ui.setControlsEnabled(true);
        showResults();
    } catch (error) {
        // Si los controles siguen desactivados
        ui.renderError(error.message);  
    }
}

function showResults() {
    const query = ui.getQuery();

    if (!query && !state.house) {
        state.visible = [];
        ui.renderInitialState();
        return;
    }

    state.visible = filterCharacters(state.all, { query, house: state.house }).map(formatCharacter);
    ui.renderCharacters(state.visible);
}

function openCharacter(card) {
    const character = state.visible.find(c => c.id === card.dataset.id);
    if (character) ui.renderModal(character);
}

function toggleHouse(chip) {
    const house = chip.dataset.house;
    state.house = state.house === house ? null : house;
    ui.renderHouseFilters(state.counts, state.house);
    showResults();
}

// Delegación de eventos
// Cada elemento declara qué quiere hacer con data-action.
const actions = { search: showResults, retry: initApp, 'toggle-house': toggleHouse, 'open-character': openCharacter, 'close-modal': ui.closeModal };

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal-backdrop')) {
        ui.closeModal();    // click fuera de la tarjeta
        return;
    }
    const element = event.target.closest('[data-action]');
    if (element) actions[element.dataset.action]?.(element);
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') ui.closeModal();

    if (event.key === 'Enter' && event.target.id === 'search') showResults();
});

// Si una imagen falla, se pone el placeholder. No hay event de error
document.addEventListener('error', (event) => {
    const img = event.target;
    if (img.tagName === 'IMG' && !img.dataset.failed) {
        img.dataset.failed = 'true';    // evita un bucle si el placeholder también fallara
        img.src = ui.PLACEHOLDER;
    }
}, true);

initApp();
