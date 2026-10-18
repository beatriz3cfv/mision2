// Capa de render, construye DOM. Eventos en main
export const PLACEHOLDER = '/placeholder.webp';

// Se busca el contenedor al usarlo
const getApp = () => document.querySelector('#app');

// Todo lo que viene de la API se escapa antes de entrar en un innerHTML
export function escapeHTML(value) {
    const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(value ?? '').replace(/[&<>"']/g, (ch) => entities[ch]);
}

// "Gryffindor" -> "house-gryffindor" (los colores viven en el CSS)
const houseClass = (house) => `house-${String(house).toLowerCase().replace(/[^a-z]/g, '')}`;

export function getQuery() {
    return document.querySelector('#search').value.trim();
}

export function setControlsEnabled(enabled) {
    document.querySelector('#search').disabled = !enabled;
    document.querySelector('#search-btn').disabled = !enabled;
}

export function renderInitialState() {
    getApp().innerHTML = `<p class="initial-message">Escribe el nombre o la casa de un personaje, o elige una casa, para empezar.</p>`;
}

export function renderLoading() {
    getApp().innerHTML = `<p class="loading" role="status">Cargando personajes… la primera vez puede tardar unos segundos.</p>`;
}

export function renderError(message) {
    getApp().innerHTML = `
        <div class="error" role="alert">
            <p>Hubo un problema: ${escapeHTML(message)}</p>
            <button type="button" class="retry-btn" data-action="retry">Reintentar</button>
        </div>`;
}

export function renderHouseFilters(counts, activeHouse) {
    const chips = Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .map(([house, total]) => `
            <button type="button"
                    class="chip ${houseClass(house)} ${house === activeHouse ? 'active' : ''}"
                    data-action="toggle-house"
                    data-house="${escapeHTML(house)}"
                    aria-pressed="${house === activeHouse}">
                ${escapeHTML(house)} <span class="chip-count">${total}</span>
            </button>`)
        .join('');

    document.querySelector('#house-filters').innerHTML = chips;
}

export function renderCharacters(characters) {
    if (characters.length === 0) {
        getApp().innerHTML = `<p class="empty">No se encontraron personajes con esos criterios.</p>`;
        return;
    }

    const cardsHTML = characters.map(char => `
        <article class="card ${houseClass(char.house)}" data-action="open-character"
                 data-id="${escapeHTML(char.id)}" role="button" tabindex="0">
            <div class="card-img-container">
                <img src="${escapeHTML(char.image || PLACEHOLDER)}" alt="${escapeHTML(char.name)}" loading="lazy" />
            </div>
            <div class="card-content">
                <h2>${escapeHTML(char.name)}</h2>
                <p class="house-badge">${escapeHTML(char.house)}</p>
                <p><strong>Actor:</strong> ${escapeHTML(char.actor)}</p>
            </div>
        </article>`).join('');

    const total = characters.length;
    getApp().innerHTML = `
        <p class="results-count">${total} ${total === 1 ? 'personaje' : 'personajes'}</p>
        <section class="grid-container">${cardsHTML}</section>`;
}

export function renderModal(char) {
    closeModal();

    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'modal-backdrop';
    modalBackdrop.innerHTML = `
        <div class="modal-card ${houseClass(char.house)}" role="dialog" aria-modal="true" aria-label="${escapeHTML(char.name)}">
            <button type="button" class="close-btn" data-action="close-modal" aria-label="Cerrar">&times;</button>
            <div class="modal-img-container">
                <img src="${escapeHTML(char.image || PLACEHOLDER)}" alt="${escapeHTML(char.name)}" />
            </div>
            <div class="modal-info">
                <h2>${escapeHTML(char.name)}</h2>
                <p><strong>Casa:</strong> ${escapeHTML(char.house)}</p>
                <p><strong>Especie:</strong> ${escapeHTML(char.species)}</p>
                <p><strong>Patronus:</strong> ${escapeHTML(char.patronus)}</p>
                <p><strong>Actor:</strong> ${escapeHTML(char.actor)}</p>
                <p><strong>Nacimiento:</strong> ${escapeHTML(char.dateOfBirth)}</p>
                <p><strong>Varita:</strong> ${escapeHTML(char.wand)}</p>
                <p><strong>Estado:</strong> ${escapeHTML(char.alive)}</p>
            </div>
        </div>`;

    document.body.appendChild(modalBackdrop);
    modalBackdrop.querySelector('.close-btn').focus();
}

export function closeModal() {
    document.querySelector('.modal-backdrop')?.remove();
}
