import { fetchCharacters } from './api.js';
import { searchAndFormatCharacters } from './logic.js';
import { renderLoading, renderError, renderCharacters, renderInitialState, renderModal } from './ui.js';
import './styles.css';

let allCharacters = [];
let currentFilteredCharacters = [];

async function initApp() {
    renderInitialState();
    try {
        allCharacters = await fetchCharacters();

    } catch (error) {
        renderError(error.message);
    }
}

function handleSearch() {
    const searchInput = document.querySelector('#search');
    const query = searchInput.value.trim();

    if (query === '') {
        renderInitialState();
        return;
    }

    renderLoading();

    // Retraso para ver el mensaje de carga
    setTimeout(() => {
        currentFilteredCharacters = searchAndFormatCharacters(allCharacters, query);
        renderCharacters(currentFilteredCharacters);
        attachCardEvents();
    }, 400);
}

function attachCardEvents() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const selectedCharacter = currentFilteredCharacters.find(c => c.id === id);
        if (selectedCharacter) {
            renderModal(selectedCharacter);
        }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initApp();

    const searchBtn = document.querySelector('#search-btn');
    const searchInput = document.querySelector('#search');

    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
        });
    }
});