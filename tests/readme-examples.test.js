import { describe, test, expect, vi } from "vitest";
import { createCache } from "../src/storage/memory.js";

describe("README Examples Tests", () => {
  describe("Basic Usage Examples", () => {
    test("basic operations work as shown in README", () => {
      const cache = createCache();

      // Test basic set/get
      cache.set("user", { id: 1, name: "John" });
      expect(cache.get("user")).toEqual({ id: 1, name: "John" });

      // Test TTL
      cache.set("temporaryData", "This will expire", 100);
      expect(cache.get("temporaryData")).toBe("This will expire");

      // Test existence check
      expect(cache.has("user")).toBe(true);

      // Test delete
      cache.delete("user");
      expect(cache.has("user")).toBe(false);

      // Test clear and size
      cache.set("item1", "value1");
      cache.set("item2", "value2");
      expect(cache.size()).toBe(3); // including temporaryData
      cache.clear();
      expect(cache.size()).toBe(0);
    });
  });

  describe("API Response Caching Example", () => {
    test("fetchUserWithCache works as expected", async () => {
      const apiCache = createCache();
      const mockUserData = { id: 1, name: "John" };

      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockUserData),
      });

      async function fetchUserWithCache(userId) {
        if (apiCache.has(userId)) {
          return apiCache.get(userId);
        }
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        apiCache.set(userId, userData, 5 * 60 * 1000);
        return userData;
      }

      // First call - should fetch
      const result1 = await fetchUserWithCache("1");
      expect(result1).toEqual(mockUserData);
      expect(fetch).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const result2 = await fetchUserWithCache("1");
      expect(result2).toEqual(mockUserData);
      expect(fetch).toHaveBeenCalledTimes(1); // Still 1, used cache
    });
  });

  describe("Rate Limiter Example", () => {
    test("rate limiter functions correctly", () => {
      const rateLimitCache = createCache();

      function checkRateLimit(ip, limit = 100) {
        const current = rateLimitCache.get(ip) || 0;
        if (current >= limit) return false;
        rateLimitCache.set(ip, current + 1, 60 * 1000);
        return true;
      }

      // Test within limit
      for (let i = 0; i < 5; i++) {
        expect(checkRateLimit("127.0.0.1", 5)).toBe(true);
      }

      // Test exceeding limit
      expect(checkRateLimit("127.0.0.1", 5)).toBe(false);
    });
  });

  describe("Computed Values Caching Example", () => {
    test("expensive computation caching works", () => {
      const computeCache = createCache();

      function expensiveComputation(input) {
        const cacheKey = `compute_${input}`;
        if (computeCache.has(cacheKey)) {
          return computeCache.get(cacheKey);
        }
        const result = Array(input)
          .fill(0)
          .reduce((acc) => acc + Math.random(), 0);
        computeCache.set(cacheKey, result, 30 * 1000);
        return result;
      }

      // First computation
      const result1 = expensiveComputation(5);
      // Second computation with same input should return cached value
      const result2 = expensiveComputation(5);
      expect(result1).toBe(result2);

      // Different input should give different result
      const result3 = expensiveComputation(10);
      expect(result1).not.toBe(result3);
    });
  });
});
