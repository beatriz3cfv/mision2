// Lógica de manipulación de datos

export function searchAndFormatCharacters(characters, query) {
    const searchTerm = query.toLowerCase().trim();
    
    return characters
        .filter(char => {
            // Formateamos  cada campo para evitar errores
            const name = (char.name || '').toLowerCase();
            const house = (char.house || '').toLowerCase();
            const patronus = (char.patronus || '').toLowerCase();
            const actor = (char.actor || '').toLowerCase();
            const species = (char.species || '').toLowerCase();
            
            // La varita puede venir como un objeto con madera, núcleo y longitud, o null
            const wandWood = (char.wand && char.wand.wood) ? char.wand.wood.toLowerCase() : '';
            const wandCore = (char.wand && char.wand.core) ? char.wand.core.toLowerCase() : '';
            const wandText = `${wandWood} ${wandCore}`;

            // Vemos si coincide con cualquiera de los campos
            return (
                name.includes(searchTerm) ||
                house.includes(searchTerm)
            );
        })
        .map(char => ({
        id: char.id,
        name: char.name,
        house: char.house || 'Desconocida',
        patronus: char.patronus || 'Desconocido',
        image: (char.image && char.image.trim() !== '') ? char.image : '/placeholder.webp',
        actor: char.actor || 'Desconocido',
        dateOfBirth: char.dateOfBirth || 'Desconocido',
        species: char.species || 'Desconocida',
        wand: char.wand ? `${char.wand.wood || ''} ${char.wand.core || ''} (${char.wand.length || ''}in)`.trim() : 'Desconocida',
        alive: char.alive !== undefined ? (char.alive ? 'Vivo' : 'Fallecido') : 'Desconocido'
    }));
}