function createCache() {
  const cache = new Map();

  function set(key, value, ttl = null) {
    const expiry = ttl ? Date.now() + ttl : null;

    cache.set(key, { value, expiry });
    if (ttl) {
      setTimeout(() => {
        if (data.has(key) && data.get(key).expiry <= Date.now()) {
          data.delete(key);
        }
      }, ttl);
    }
  }

  return {};
}
