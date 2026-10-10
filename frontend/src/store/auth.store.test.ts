import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./auth.store";
import type { AuthUser } from "@/types/api";

describe("auth.store", () => {
  beforeEach(() => {
    useAuthStore.getState().clear();
  });

  it("sets and clears user correctly without token", () => {
    const user: AuthUser = {
      id: 1,
      name: "Test User",
      email: "test@meridianmoto.ae",
      role: "admin",
    };

    const store = useAuthStore.getState();
    expect(store.user).toBeNull();

    store.setUser(user);
    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState()).not.toHaveProperty("token");

    store.clear();
    expect(useAuthStore.getState().user).toBeNull();
  });
});
