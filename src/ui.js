const appContainer = document.querySelector('#app');

export function renderInitialState() {
    appContainer.innerHTML = `<p class="initial-message">🔍 Escribe el nombre de un personaje de Harry Potter y haz clic en Buscar.</p>`;
}

export function renderLoading() {
    appContainer.innerHTML = `<p class="loading">Cargando personajes de Hogwarts...</p>`;
}

export function renderError(message) {
    appContainer.innerHTML = `<p class="error">❌ Hubo un problema: ${message}</p>`;
}

export function renderCharacters(characters) {
    if (characters.length === 0) {
        appContainer.innerHTML = `<p class="empty">No se encontraron personajes con esos criterios.</p>`;
        return;
    }

const cardsHTML = characters.map(char => `
    <article class="card" data-id="${char.id}">
      <div class="card-img-container">
        <img src="${char.image}" alt="${char.name}" loading="lazy" />
      </div>
      <div class="card-content">
        <h2>${char.name}</h2>
        <p><strong>Casa:</strong> ${char.house}</p>
        <p><strong>Actor:</strong> ${char.actor}</p>
      </div>
    </article>
    `).join('');

    appContainer.innerHTML = `<section class="grid-container">${cardsHTML}</section>`;
}

export function renderModal(char) {
    const existingModal = document.querySelector('.modal-backdrop');
    if (existingModal) existingModal.remove();

    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'modal-backdrop';

    modalBackdrop.innerHTML = `
        <div class="modal-card">
        <button class="close-btn">&times;</button>
        <div class="modal-img-container">
            <img src="${char.image}" alt="${char.name}" />
        </div>
        <div class="modal-info">
            <h2>${char.name}</h2>
            <p><strong>Casa:</strong> ${char.house}</p>
            <p><strong>Patronus:</strong> ${char.patronus}</p>
            <p><strong>Actor:</strong> ${char.actor}</p>
            <p><strong>Nacimiento:</strong> ${char.dateOfBirth}</p>
            <p><strong>Varita:</strong> ${char.wand}</p>
            <p><strong>Estado:</strong> ${char.alive}</p>
        </div>
        </div>
    `;

    document.body.appendChild(modalBackdrop);

    const closeModal = () => modalBackdrop.remove();
    modalBackdrop.querySelector('.close-btn').addEventListener('click', closeModal);
    
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
    });
}