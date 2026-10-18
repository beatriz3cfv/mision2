// Caché en localStorage para no pedir los personajes a la API en cada visita.
const CACHE_KEY = 'hp-characters';
const TTL_MS = 60 * 60 * 1000; // 1 hora

export function readCache() {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;

        const { savedAt, data } = JSON.parse(raw);
        const isFresh = Date.now() - savedAt < TTL_MS;
        return isFresh && Array.isArray(data) ? data : null;
    } catch {
        // JSON corrupto o localStorage bloqueado: lo tratamos como "no hay caché"
        return null;
    }
}

export function writeCache(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }));
    } catch {
        // Cuota llena o modo privado: la app funciona igual, solo sin caché
    }
}
