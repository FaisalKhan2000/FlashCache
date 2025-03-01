# flash-cache/flash-cache/README.md

# flashcache

flashcache is a simple and efficient in-memory caching solution for JavaScript applications. It provides methods to set, get, check existence, delete keys, clear the cache, and get the size of the cache.

## Installation

You can install flashcache via npm:

```
npm install flash-cache
```

## Usage

To use flashcache, first import the `createCache` function and then create a cache instance:

```javascript
import createCache from 'flash-cache';

const cache = createCache();

// Set a value with an optional time-to-live (TTL)
cache.set('key', 'value', 10000); // TTL of 10 seconds

// Get a value
const value = cache.get('key');

// Check if a key exists
const exists = cache.has('key');

// Delete a key
cache.delete('key');

// Clear the cache
cache.clear();

// Get the size of the cache
const size = cache.size();
```

## Testing

To run the tests for flashcache, you can use Vitest. Make sure you have installed the dependencies and then run:

```
npm test
```

## Contributing

If you would like to contribute to flashcache, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.