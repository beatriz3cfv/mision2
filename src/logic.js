// Filtrar personajes por casa de Hogwarts
export function filterCharactersByHouse(characters, house) {
  if (!house || house === 'ALL') return characters;
  return characters.filter(char => char.house === house);
}

// Filtrar por texto de búsqueda (nombre) y transformar los datos necesarios
export function searchAndFormatCharacters(characters, query) {
  const searchTerm = query.toLowerCase().trim();
  
  return characters
    .filter(char => char.name.toLowerCase().includes(searchTerm))
    .map(char => ({
      id: char.id,
      name: char.name,
      house: char.house || 'Desconocida',
      patronus: char.patronus || 'Desconocido',
      // Si la API no trae imagen, ponemos una por defecto para que no rompa el diseño
      image: char.image || 'https://via.placeholder.com/150?text=Sin+Imagen',
      actor: char.actor || 'Desconocido'
    }));
}