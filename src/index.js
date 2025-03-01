import { createServer } from "./core/server.js";
import { createMemoryStore } from "./storage/memory.js";

// Export the server factory function as the main API
export default createServer;

// Also export the memory store directly for standalone use
export { createMemoryStore };
