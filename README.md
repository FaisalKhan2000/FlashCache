# flashcache

A lightweight in-memory caching solution for JavaScript applications with TTL support.

## Installation

```bash
npm i @flash0p/flashcache
```

## Features

- 🚀 Simple and lightweight
- ⏰ Time-To-Live (TTL) support
- 🧹 Automatic cleanup of expired items
- 🔍 Type-safe get/set operations

## Basic Usage

```javascript
import createCache from "@flash0p/flashcache";

// Create a new cache instance
const cache = createCache();

// Basic operations
cache.set("user", { id: 1, name: "John" });
const user = cache.get("user"); // { id: 1, name: "John" }

// With TTL (Time-To-Live)
cache.set("temporaryData", "This will expire", 5000); // Expires in 5 seconds

// Check existence
if (cache.has("user")) {
  console.log("User exists in cache");
}

// Delete specific item
cache.delete("user");

// Clear entire cache
cache.clear();

// Get cache size
const size = cache.size(); // Returns number of items in cache
```

## Advanced Usage Examples

### Caching API Responses

```javascript
const apiCache = createCache();

async function fetchUserWithCache(userId) {
  if (apiCache.has(userId)) {
    return apiCache.get(userId);
  }

  const response = await fetch(`/api/users/${userId}`);
  const userData = await response.json();

  // Cache for 5 minutes
  apiCache.set(userId, userData, 5 * 60 * 1000);

  return userData;
}
```

### Using as a Rate Limiter

```javascript
const rateLimitCache = createCache();

function checkRateLimit(ip, limit = 100) {
  const current = rateLimitCache.get(ip) || 0;

  if (current >= limit) {
    return false;
  }

  rateLimitCache.set(ip, current + 1, 60 * 1000); // Reset after 1 minute
  return true;
}
```

### Caching Computed Values

```javascript
const computeCache = createCache();

function expensiveComputation(input) {
  const cacheKey = `compute_${input}`;

  if (computeCache.has(cacheKey)) {
    return computeCache.get(cacheKey);
  }

  // Simulate expensive computation
  const result = Array(input)
    .fill(0)
    .reduce((acc) => acc + Math.random(), 0);

  computeCache.set(cacheKey, result, 30 * 1000); // Cache for 30 seconds
  return result;
}
```

## API Reference

### `createCache()`

Creates a new cache instance.

### `cache.set(key, value, ttl)`

Sets a value in the cache. Optional TTL in milliseconds.

### `cache.get(key)`

Retrieves a value from the cache. Returns undefined if not found or expired.

### `cache.has(key)`

Checks if a key exists and is not expired.

### `cache.delete(key)`

Removes a specific key from the cache.

### `cache.clear()`

Removes all items from the cache.

### `cache.size()`

Returns the number of items currently in the cache.

## Testing

```bash
npm test
```

## License

MIT License
