/**
 * In-memory storage engine for FlashCache
 */
export function createCache() {
  const store = new Map();
  const expiryTimers = new Map();

  return {
    /**
     * Set a key-value pair with optional expiry
     */
    set(key, value, ttl = null) {
      // Clear any existing expiry timer
      if (expiryTimers.has(key)) {
        clearTimeout(expiryTimers.get(key));
        expiryTimers.delete(key);
      }

      const expiry = ttl ? Date.now() + ttl : null;
      store.set(key, { value, expiry });

      // Set expiry timer if needed
      if (ttl) {
        const timer = setTimeout(() => {
          this.delete(key);
          expiryTimers.delete(key);
        }, ttl);

        expiryTimers.set(key, timer);
      }

      return true;
    },

    /**
     * Retrieve a value by key
     */
    get(key) {
      const entry = store.get(key);

      if (!entry) return null;

      // Check if expired
      if (entry.expiry && entry.expiry <= Date.now()) {
        this.delete(key);
        return null;
      }

      return entry.value;
    },

    /**
     * Check if key exists and is not expired
     */
    has(key) {
      const entry = store.get(key);

      if (!entry) return false;

      // Check if expired
      if (entry.expiry && entry.expiry <= Date.now()) {
        this.delete(key);
        return false;
      }

      return true;
    },

    /**
     * Delete a key
     */
    delete(key) {
      // Clear any expiry timer
      if (expiryTimers.has(key)) {
        clearTimeout(expiryTimers.get(key));
        expiryTimers.delete(key);
      }

      return store.delete(key);
    },

    /**
     * Clear all keys
     */
    clear() {
      // Clear all expiry timers
      for (const timer of expiryTimers.values()) {
        clearTimeout(timer);
      }
      expiryTimers.clear();
      store.clear();

      return true;
    },

    /**
     * Get number of keys
     */
    size() {
      return store.size;
    },

    /**
     * Set expiry on existing key
     */
    expire(key, ttl) {
      const entry = store.get(key);

      if (!entry) return false;

      // Clear existing timer
      if (expiryTimers.has(key)) {
        clearTimeout(expiryTimers.get(key));
      }

      // Set new expiry
      entry.expiry = Date.now() + ttl;

      // Set new timer
      const timer = setTimeout(() => {
        this.delete(key);
        expiryTimers.delete(key);
      }, ttl);

      expiryTimers.set(key, timer);

      return true;
    },

    /**
     * Get remaining TTL in ms for a key
     */
    ttl(key) {
      const entry = store.get(key);

      if (!entry) return -2; // Key does not exist
      if (!entry.expiry) return -1; // No expiry set

      const remaining = entry.expiry - Date.now();

      if (remaining <= 0) {
        this.delete(key);
        return -2;
      }

      return remaining;
    },
  };
}
