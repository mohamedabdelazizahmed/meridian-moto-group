import { describe, it, expect, beforeEach } from "vitest";
import { useUiStore } from "./ui.store";

describe("ui.store", () => {
  beforeEach(() => {
    useUiStore.setState({ mobileMenuOpen: false, sidebarOpen: true });
  });

  it("toggles mobile menu", () => {
    const store = useUiStore.getState();
    expect(store.mobileMenuOpen).toBe(false);

    store.toggleMobileMenu();
    expect(useUiStore.getState().mobileMenuOpen).toBe(true);

    store.setMobileMenuOpen(false);
    expect(useUiStore.getState().mobileMenuOpen).toBe(false);
  });

  it("toggles sidebar", () => {
    const store = useUiStore.getState();
    expect(store.sidebarOpen).toBe(true);

    store.toggleSidebar();
    expect(useUiStore.getState().sidebarOpen).toBe(false);

    store.setSidebarOpen(true);
    expect(useUiStore.getState().sidebarOpen).toBe(true);
  });
});
