import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { userSchema } from "./schema";
import { UsersTable } from "./components/UsersTable";
import { UserForm } from "./components/UserForm";
import CmsSidebar from "@/components/CmsSidebar";
import CmsUsersPage from "@/app/cms/(panel)/users/page";
import { useAuthStore } from "@/store/auth.store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { User, Brand } from "@/types/api";

const mockBrands: Brand[] = [
  { id: 1, name: "Apex", slug: "apex", accent_color: "#E5322D" },
  { id: 2, name: "Volt", slug: "volt", accent_color: "#00E5FF" },
];

describe("Admin Users Feature", () => {
  describe("schema.ts", () => {
    it("validates valid admin payload without brand_ids", () => {
      const valid = {
        name: "Admin Person",
        email: "admin@meridian.test",
        password: "Password123",
        role: "admin",
        brand_ids: [],
      };
      const result = userSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("validates valid data_entry payload with brand_ids", () => {
      const valid = {
        name: "Entry Person",
        email: "entry@meridian.test",
        password: "Password123",
        role: "data_entry",
        brand_ids: [1, 2],
      };
      const result = userSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("fails data_entry payload when brand_ids is empty", () => {
      const invalid = {
        name: "Entry Person",
        email: "entry@meridian.test",
        password: "Password123",
        role: "data_entry",
        brand_ids: [],
      };
      const result = userSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("fails weak password without letters or numbers", () => {
      const invalid = {
        name: "Weak Pass",
        email: "weak@meridian.test",
        password: "password",
        role: "admin",
        brand_ids: [],
      };
      const result = userSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("parity test: minimal valid payload matches all required backend fields", () => {
      const payload = {
        name: "Parity Admin",
        email: "parity@meridian.test",
        password: "Password123",
        role: "admin",
        brand_ids: [],
      };
      const parsed = userSchema.parse(payload);
      expect(parsed).toHaveProperty("name");
      expect(parsed).toHaveProperty("email");
      expect(parsed).toHaveProperty("password");
      expect(parsed).toHaveProperty("role");
      expect(parsed).toHaveProperty("brand_ids");
    });
  });

  describe("UsersTable component", () => {
    const mockUsers: User[] = [
      {
        id: 1,
        name: "Karim Admin",
        email: "admin@meridian.test",
        role: "admin",
        brands: [],
        created_at: "2026-10-08T08:00:00.000000Z",
      },
      {
        id: 2,
        name: "Tariq Entry",
        email: "entry1@meridian.test",
        role: "data_entry",
        brands: [
          { id: 1, name: "Apex", slug: "apex", segment: "Performance", accent_color: "#E5322D" },
        ],
        created_at: "2026-10-08T08:00:00.000000Z",
      },
    ];

    it("renders users list with role badges and brand chips", () => {
      render(
        <UsersTable
          users={mockUsers}
          isLoading={false}
          currentUserId={1}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      );
      expect(screen.getByText("Karim Admin")).toBeDefined();
      expect(screen.getByText("Tariq Entry")).toBeDefined();
      expect(screen.getByText("Administrator")).toBeDefined();
      expect(screen.getByText("Data Entry")).toBeDefined();
      expect(screen.getByText("Apex")).toBeDefined();
      expect(screen.getByText("YOU")).toBeDefined();
    });

    it("disables delete button for current user (self-protection)", () => {
      render(
        <UsersTable
          users={mockUsers}
          isLoading={false}
          currentUserId={1}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      );
      const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
      expect(deleteButtons[0]).toBeDisabled();
      expect(deleteButtons[1]).not.toBeDisabled();
    });

    it("renders empty state when users array is empty", () => {
      render(
        <UsersTable
          users={[]}
          isLoading={false}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      );
      expect(screen.getByText("No user accounts match your search or filter criteria.")).toBeDefined();
    });
  });

  describe("UserForm component", () => {
    it("renders form fields and hides brand selection when role is admin", () => {
      render(
        <UserForm
          initialData={{
            id: 1,
            name: "Admin User",
            email: "admin@meridian.test",
            role: "admin",
            brands: [],
          }}
          brands={mockBrands}
          onSubmit={() => {}}
          isPending={false}
          onCancel={() => {}}
        />
      );

      expect(screen.getByDisplayValue("Admin User")).toBeDefined();
      expect(screen.getByDisplayValue("admin@meridian.test")).toBeDefined();
      expect(screen.queryByText("Assigned Marque Brands")).toBeNull();
    });

    it("disables role select when editing own account (self-protection)", () => {
      render(
        <UserForm
          initialData={{
            id: 1,
            name: "Admin Self",
            email: "admin@meridian.test",
            role: "admin",
            brands: [],
          }}
          currentUserId={1}
          brands={mockBrands}
          onSubmit={() => {}}
          isPending={false}
          onCancel={() => {}}
        />
      );

      const roleSelect = screen.getByRole("combobox");
      expect(roleSelect).toBeDisabled();
      expect(screen.getByText("Admins cannot change their own role.")).toBeDefined();
    });
  });

  describe("Sidebar navigation & Page access guard", () => {
    it("shows Users link in sidebar for admin but not for data entry", () => {
      const { unmount } = render(<CmsSidebar currentRole="admin" />);
      expect(screen.getByText("User Management")).toBeDefined();
      unmount();

      render(<CmsSidebar currentRole="data_entry" />);
      expect(screen.queryByText("User Management")).toBeNull();
    });

    it("renders 403 Forbidden state for data entry users visiting users page", () => {
      useAuthStore.setState({
        user: {
          id: 2,
          name: "Data Entry User",
          email: "entry@meridian.test",
          role: "data_entry",
          brands: [],
        },
      });

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });

      render(
        <QueryClientProvider client={queryClient}>
          <CmsUsersPage />
        </QueryClientProvider>
      );

      expect(screen.getByText("403 Forbidden")).toBeDefined();
      expect(screen.getByText("Restricted Access")).toBeDefined();
    });
  });
});
