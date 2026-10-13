// Renderizado en el DOM y estados carga/error

const appDiv = document.querySelector('#app');
let modal = null;

// Textos de la api no se insertar en innerhtml sin escapar
function escapeHtml(value) {
    const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(value).replace(/[&<>"']/g, char => entities[char]);
}

// Indicador de carga
export function renderLoading() {
    appDiv.innerHTML = `<div class="loading">Cargando la colección del museo...</div>`;
}

// Enseñar mensaje de error
export function renderError(message) {
    appDiv.innerHTML = `<div class="error">Hubo un problema ${escapeHtml(message)}. Reintenta.</div>`;
}

// Cargar las obras en el DOM
export function renderArtwork(artworksList) {
    if (artworksList.length === 0) {
        appDiv.innerHTML = `<p class="empty">No se encontraron obras de arte. Prueba otra búsqueda.<p>`;
        return;
    }

    const cards = artworksList.map(art => `
        <article class="art-card" data-id="${art.id}" tabindex="0" role="button">
            <img src="${escapeHtml(art.imageUrl)}" alt="${escapeHtml(art.title)}" loading="lazy" />
            <div class="art-info">
                <h3>${escapeHtml(art.title)}</h3>
                <p class="artist">${escapeHtml(art.artist)}</p>
                <p class="details"><span>${escapeHtml(art.year)}</span> • <span>${escapeHtml(art.type)}</span></p>
                ${art.medium ? `<p class="medium">${escapeHtml(art.medium)}</p>` : ''}
                ${art.origin ? `<p class="medium">${escapeHtml(art.origin)}</p>` : ''}
            </div>
        </article>
    `).join('');
    appDiv.innerHTML = `<div class="art-grid">${cards}</div>`;
}

// Ventana de la obra (modal)
export function initModal(onClose) {
    modal = document.querySelector('div');
    modal.className = 'modal hidden';
    modal.innerHTML = `
        <div class="modal-content" role="dialog" aria-modal="true">
            <button class="modal-close" aria-label="Cerrar">×</button>
            <div class="modal-body"></div>
        </div>`;
    document.body.appendChild(modal);

    const close = () => {
        modal.classList.add('hidden');
        if (onClose) onClose();
    };

    // Cerrar con la X o click fuera
    modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.closest('.modal-close')) close();
    });
}

function showInModal(html) {
    modal.querySelector('.modal-body').innerHTML = html;
    modal.classList.remove('hidden');
}

export function renderDetailLoading() {
    showInModal(`<p class="loading">Cargando la ficha de la obra...</p>`);
}

export function renderDetail(art) {
    // Solo mostramos los datos que existen
    const rows = [ ['Fecha', art.year], ['Tipo', art.type], ['Técnica', art.medium], ['Origen', art.origin], ['Estilo', art.style], ['Dimensiones', art.dimensions], ['Crédito', art.credit]]
        .filter(([, value]) => value)
        .map(([label, value]) => `<dt>${label}</dt><dd>${escapeHtml(value)}</dd>`)
        .join('');

    const image = art.imageUrl ? `<img src="${escapeHtml(art.imageUrl)}" alt="${escapeHtml(art.title)}" />` : `<p class="empty">Sin imagen disponible</p>`;

    showInModal(`
        <div class="detail">
            <div class="detail-image">${image}</div>
            <div class="detail-info">
                <h2>${escapeHtml(art.title)}</h2>
                <p class="artist">${escapeHtml(art.artist)}</p>
                ${art.artistExtra ? `<p class="details">${escapeHtml(art.artistExtra)}</p>` : ''}
                <p class="description">${art.description
                    ? escapeHtml(art.description)
                    : 'Esta obra no tiene descripción en la colección del museo.'}</p>
                <dl class="facts">${rows}</dl>
                ${art.publicDomain ? `<p class="details">Obra de dominio público</p>` : ''}
            </div>
        </div>`);
}
