const API_URL = 'https://hp-api.onrender.com/api/characters';

export async function fetchCharacters() {
  const cachedData = localStorage.getItem('hp_characters_cache');
  if (cachedData) {
    // Retornamos los datos guardados en caché sin consumir red de nuevo
    return JSON.parse(cachedData);
  }

  const response = await fetch('https://hp-api.onrender.com/api/characters');
  if (!response.ok) throw new Error('Error al conectar con la API');
  
  const data = await response.json();
  localStorage.setItem('hp_characters_cache', JSON.stringify(data));
  return data;
}
