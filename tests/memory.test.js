import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createCache } from "../src/storage/memory.js";

describe("createCache", () => {
  let store;

  beforeEach(() => {
    // Create a fresh store before each test
    store = createCache();

    // Mock timers for testing expiry
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Reset timers after each test
    vi.restoreAllMocks();
  });

  describe("set", () => {
    it("should store a value without expiry", () => {
      const result = store.set("key", "value");
      expect(result).toBe(true);
      expect(store.get("key")).toBe("value");
    });

    it("should store a value with expiry", () => {
      const ttl = 1000; // 1 second
      store.set("key", "value", ttl);

      // Value should exist before expiry
      expect(store.get("key")).toBe("value");

      // Advance time past expiry
      vi.advanceTimersByTime(ttl + 10);

      // Value should be gone after expiry
      expect(store.get("key")).toBeNull();
    });

    it("should replace existing value and reset expiry", () => {
      store.set("key", "value1", 1000);
      store.set("key", "value2", 2000);

      // Value should be updated
      expect(store.get("key")).toBe("value2");

      // Advance time past first expiry
      vi.advanceTimersByTime(1010);

      // Value should still exist
      expect(store.get("key")).toBe("value2");

      // Advance time to second expiry
      vi.advanceTimersByTime(1000);

      // Value should be gone
      expect(store.get("key")).toBeNull();
    });
  });

  describe("get", () => {
    it("should return null for non-existent key", () => {
      expect(store.get("nonexistent")).toBeNull();
    });

    it("should return null for expired key", () => {
      store.set("key", "value", 1000);
      vi.advanceTimersByTime(1010);
      expect(store.get("key")).toBeNull();
    });
  });

  describe("has", () => {
    it("should return false for non-existent key", () => {
      expect(store.has("nonexistent")).toBe(false);
    });

    it("should return false for expired key", () => {
      store.set("key", "value", 1000);
      vi.advanceTimersByTime(1010);
      expect(store.has("key")).toBe(false);
    });

    it("should return true for existing non-expired key", () => {
      store.set("key", "value");
      expect(store.has("key")).toBe(true);
    });
  });

  describe("delete", () => {
    it("should remove a key", () => {
      store.set("key", "value");
      expect(store.delete("key")).toBe(true);
      expect(store.get("key")).toBeNull();
    });

    it("should return false for non-existent key", () => {
      expect(store.delete("nonexistent")).toBe(false);
    });
  });

  describe("clear", () => {
    it("should remove all keys", () => {
      store.set("key1", "value1");
      store.set("key2", "value2");
      expect(store.clear()).toBe(true);
      expect(store.size()).toBe(0);
      expect(store.get("key1")).toBeNull();
    });
  });

  describe("size", () => {
    it("should return the count of non-expired keys", () => {
      expect(store.size()).toBe(0);

      store.set("key1", "value1");
      store.set("key2", "value2");
      expect(store.size()).toBe(2);

      store.set("key3", "value3", 1000);
      expect(store.size()).toBe(3);

      vi.advanceTimersByTime(1010);
      expect(store.size()).toBe(2);
    });
  });

  describe("expire", () => {
    it("should set expiry on existing key", () => {
      store.set("key", "value");
      expect(store.expire("key", 1000)).toBe(true);

      expect(store.get("key")).toBe("value");
      vi.advanceTimersByTime(1010);
      expect(store.get("key")).toBeNull();
    });

    it("should return false for non-existent key", () => {
      expect(store.expire("nonexistent", 1000)).toBe(false);
    });
  });

  describe("ttl", () => {
    it("should return remaining time for key with expiry", () => {
      store.set("key", "value", 1000);

      vi.advanceTimersByTime(500);

      // Allow for small timing differences
      const ttl = store.ttl("key");
      expect(ttl).toBeGreaterThan(450);
      expect(ttl).toBeLessThanOrEqual(500);
    });

    it("should return -1 for key without expiry", () => {
      store.set("key", "value");
      expect(store.ttl("key")).toBe(-1);
    });

    it("should return -2 for non-existent key", () => {
      expect(store.ttl("nonexistent")).toBe(-2);
    });

    it("should return -2 and delete expired key", () => {
      store.set("key", "value", 1000);
      vi.advanceTimersByTime(1010);
      expect(store.ttl("key")).toBe(-2);
      expect(store.has("key")).toBe(false);
    });
  });
});
