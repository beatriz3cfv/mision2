// Lógica de datos pura: no toca el DOM ni la red, así que es fácil de probar y reutilizar.

const normalize = (text) => (text || '').toLowerCase().trim();

// Filtra por texto (nombre o casa) y, opcionalmente, por una casa concreta.
export function filterCharacters(characters, { query = '', house = null } = {}) {
    const term = normalize(query);

    return characters.filter(char =>
        (!house || char.house === house) &&
        (!term || normalize(char.name).includes(term) || normalize(char.house).includes(term))
    );
}

function formatWand(wand) {
    if (!wand) return 'Desconocida';

    const material = [wand.wood, wand.core].filter(Boolean).join(', ');
    const length = wand.length ? `(${wand.length} in)` : '';
    // Si la varita es un objeto vacío, material y length quedan vacíos
    return [material, length].filter(Boolean).join(' ') || 'Desconocida';
}

function formatAlive(alive) {
    if (alive === true) return 'Vivo';
    if (alive === false) return 'Fallecido';
    return 'Desconocido';
}

// Convierte un personaje crudo de la API en uno listo para mostrar.
// La imagen se deja vacía si no hay: decidir el placeholder es cosa de la capa de UI.
export function formatCharacter(char) {
    return {
        id: char.id,
        name: char.name,
        house: char.house || 'Desconocida',
        patronus: char.patronus || 'Desconocido',
        image: (char.image || '').trim(),
        actor: char.actor || 'Desconocido',
        dateOfBirth: char.dateOfBirth || 'Desconocido',
        species: char.species || 'Desconocida',
        wand: formatWand(char.wand),
        alive: formatAlive(char.alive),
    };
}

// Cuenta personajes por casa con reduce: { Gryffindor: 60, Slytherin: 40, ... }
// Los personajes sin casa se ignoran.
export function countByHouse(characters) {
    return characters.reduce((counts, char) => {
        if (char.house) {
            counts[char.house] = (counts[char.house] || 0) + 1;
        }
        return counts;
    }, {});
}
