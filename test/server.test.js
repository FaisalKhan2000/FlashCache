import { describe, it, expect } from "vitest";
import { createServer } from "../src/core/server.js";

describe("createServer", () => {
  it("should return an object with a getStore method", () => {
    const server = createServer();
    expect(server).toHaveProperty("getStore");
    expect(typeof server.getStore).toBe("function");
  });

  it("should return a memory store instance from getStore", () => {
    const server = createServer();
    const store = server.getStore();

    // Check if store has all required methods
    expect(store).toHaveProperty("set");
    expect(store).toHaveProperty("get");
    expect(store).toHaveProperty("has");
    expect(store).toHaveProperty("delete");
    expect(store).toHaveProperty("clear");
    expect(store).toHaveProperty("size");
    expect(store).toHaveProperty("expire");
    expect(store).toHaveProperty("ttl");
  });

  it("should create a new store for each server instance", () => {
    const server1 = createServer();
    const server2 = createServer();

    const store1 = server1.getStore();
    const store2 = server2.getStore();

    // Set value in store1 but not store2
    store1.set("key", "value");

    // Check that store2 doesn't have the key
    expect(store1.has("key")).toBe(true);
    expect(store2.has("key")).toBe(false);
  });
});
