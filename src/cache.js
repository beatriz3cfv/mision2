// Caché en LocalStorage
const CACHE_KEY = 'hp-characters';
const TTL_MS = 60 * 60 * 1000; // 1 hora

export function readCache() {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;

        const { savedAt, data } = JSON.parse(raw);
        const fresh = Date.now() - savedAt < TTL_MS;
        return fresh && Array.isArray(data) ? data : null;
    
    } catch {
        // json corrupto o localStorage bloqueado
        return null;
    }
}

export function writeCache(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }));
    
    } catch {
        // Funciona igual solo sin caché
    }
}
