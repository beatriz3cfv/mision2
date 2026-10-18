import './styles.css';
import { fetchCharacters } from './api.js';
import { readCache, writeCache } from './cache.js';
import { filterCharacters, formatCharacter, countByHouse } from './logic.js';
import * as ui from './ui.js';

const state = {
    all: [],        // personajes crudos de la API (fuente de verdad)
    counts: {},     // { casa: nº de personajes }
    visible: [],    // resultados actuales, ya formateados
    house: null,    // casa seleccionada en los filtros
};

// Primero la caché; si no hay (o caducó), se pide a la API y se guarda
async function loadCharacters() {
    const cached = readCache();
    if (cached) return cached;

    const fresh = await fetchCharacters();
    writeCache(fresh);
    return fresh;
}

async function initApp() {
    ui.setControlsEnabled(false);   // no se puede buscar sin datos
    ui.renderLoading();             // el loading real: durante la petición real

    try {
        state.all = await loadCharacters();
        state.counts = countByHouse(state.all);
        ui.renderHouseFilters(state.counts, state.house);
        ui.setControlsEnabled(true);
        showResults();
    } catch (error) {
        ui.renderError(error.message);  // los controles siguen desactivados
    }
}

// Los datos ya están en memoria, así que filtrar es instantáneo: no hace falta "loading"
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

// Delegación de eventos: un único listener de click para toda la app.
// Cada elemento declara qué quiere hacer con data-action.
const actions = {
    search: showResults,
    retry: initApp,
    'toggle-house': toggleHouse,
    'open-character': openCharacter,
    'close-modal': ui.closeModal,
};

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal-backdrop')) {
        ui.closeModal();    // clic fuera de la tarjeta
        return;
    }
    const element = event.target.closest('[data-action]');
    if (element) actions[element.dataset.action]?.(element);
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') ui.closeModal();

    if (event.key === 'Enter' && event.target.id === 'search') showResults();

    // Las tarjetas son role="button": también se abren con teclado
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.card')) {
        event.preventDefault();
        openCharacter(event.target);
    }
});

// Si una imagen falla, se cambia por el placeholder. El evento "error" no burbujea,
// por eso se escucha en fase de captura.
document.addEventListener('error', (event) => {
    const img = event.target;
    if (img.tagName === 'IMG' && !img.dataset.failed) {
        img.dataset.failed = 'true';    // evita un bucle si el placeholder también fallara
        img.src = ui.PLACEHOLDER;
    }
}, true);

initApp();
