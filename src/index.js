export function createCache() {
  const cache = new Map();

  function set(key, value, ttl = null) {
    const expiry = ttl ? Date.now() + ttl : null;

    cache.set(key, { value, expiry });
    if (ttl) {
      setTimeout(() => {
        if (cache.has(key) && cache.get(key).expiry <= Date.now()) {
          cache.delete(key);
        }
      }, ttl);
    }
  }

  function get(key) {
    const entry = cache.get(key);

    if (!entry) return undefined;

    if (entry.expiry && entry.expiry <= Date.now()) {
      cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  function has(key) {
    return cache.has(key) && get(key) !== undefined;
  }

  function deleteKey(key) {
    return cache.delete(key);
  }

  function clear() {
    cache.clear();
  }

  function size() {
    return cache.size;
  }

  return { set, get, has, delete: deleteKey, clear, size };
}
