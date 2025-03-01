import { createMemoryStore } from "../storage/memory.js";

export function createServer(config = {}) {
  const store = createMemoryStore();

  return {
    /**
     * Get memory store instance
     */
    getStore() {
      return store;
    },
  };
}
