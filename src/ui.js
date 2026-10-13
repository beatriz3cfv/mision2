const appContainer = document.querySelector('#app');

export function renderInitialState() {
  const appContainer = document.querySelector('#app');
  appContainer.innerHTML = `<p class="initial-message">🔍 Escribe el nombre de un personaje de Harry Potter para comenzar la búsqueda.</p>`;
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

  // Generamos el HTML usando .map() interno o un string acumulado limpio
  const cardsHTML = characters.map(char => `
    <article class="card">
      <img src="${char.image}" alt="${char.name}" loading="lazy" />
      <div class="card-content">
        <h2>${char.name}</h2>
        <p><strong>Casa:</strong> ${char.house}</p>
        <p><strong>Patronus:</strong> ${char.patronus}</p>
        <p><strong>Actor:</strong> ${char.actor}</p>
      </div>
    </article>
  `).join('');

  appContainer.innerHTML = `<section class="grid-container">${cardsHTML}</section>`;
}