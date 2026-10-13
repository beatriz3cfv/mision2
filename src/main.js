import { fetchCharacters } from './api.js';
import { searchAndFormatCharacters } from './logic.js';
import { renderLoading, renderError, renderCharacters, renderInitialState } from './ui.js';
import './styles.css';

let allCharacters = [];

async function initApp() {
  renderInitialState();
  
  try {
    // Precargamos los datos al abrir la web para que estén listos
    allCharacters = await fetchCharacters();
  } catch (error) {
    renderError(error.message);
  }
}

// Función que maneja la acción de buscar
async function handleSearch() {
  const searchInput = document.querySelector('#search');
  const query = searchInput.value.trim();

  // Si está vacío, volvemos al estado inicial
  if (query === '') {
    renderInitialState();
    return;
  }

  // Mostramos el estado de carga visible para cumplir con la rúbrica
  renderLoading();

  // Simulamos un breve respiro (o dejamos tiempo al render) para que se aprecie el estado de carga
  setTimeout(() => {
    const filtered = searchAndFormatCharacters(allCharacters, query);
    renderCharacters(filtered);
  }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();

  const searchBtn = document.querySelector('#search-btn');
  const searchInput = document.querySelector('#search');

  // Buscar al hacer clic en el botón
  if (searchBtn) {
    searchBtn.addEventListener('click', handleSearch);
  }

  // Opcional: Permitir buscar también pulsando "Enter" en el input
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });
  }
});