import { createCache } from "../storage/memory.js";

export function createServer(config = {}) {
  const store = createCache();

  return {
    /**
     * Get memory store instance
     */
    getStore() {
      return store;
    },
  };
}
