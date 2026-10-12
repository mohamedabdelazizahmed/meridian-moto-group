"use client";

import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { UseFormSetError } from "react-hook-form";
import CmsSidebar from "@/components/CmsSidebar";
import CmsHeader from "@/components/CmsHeader";
import CmsFooter from "@/components/CmsFooter";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  useUsersList,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/features/admin-users/hooks";
import { UserForm } from "@/features/admin-users/components/UserForm";
import { UsersTable } from "@/features/admin-users/components/UsersTable";
import { listBrands } from "@/features/admin-brands/api";
import { useAuthStore } from "@/store/auth.store";
import { canAccessUsers } from "@/lib/roles";
import type { User, Brand } from "@/types/api";
import type { UserFormData } from "@/features/admin-users/schema";

export default function CmsUsersPage() {
  const [roleMode, setRoleMode] = useState<"data_entry" | "admin">("admin");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const setErrorRef = useRef<UseFormSetError<UserFormData> | null>(null);

  const currentUser = useAuthStore((s) => s.user);

  // Unconditional hook calls
  const { data: response, isLoading: isLoadingUsers } = useUsersList({
    search: search || undefined,
    role: roleFilter !== "All" ? roleFilter : undefined,
  });

  const users = response?.data || [];

  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["admin-brands"],
    queryFn: listBrands,
  });

  const { mutate: createUser, isPending: isCreating } = useCreateUser(
    (errs) => {
      if (setErrorRef.current) {
        Object.entries(errs).forEach(([field, msg]) => {
          if (setErrorRef.current && msg?.[0]) {
            setErrorRef.current(field as keyof UserFormData, { type: "server", message: msg[0] });
          }
        });
      }
    },
    () => {
      setIsModalOpen(false);
      setEditingUser(null);
    }
  );

  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser(
    editingUser?.id || "",
    (errs) => {
      if (setErrorRef.current) {
        Object.entries(errs).forEach(([field, msg]) => {
          if (setErrorRef.current && msg?.[0]) {
            setErrorRef.current(field as keyof UserFormData, { type: "server", message: msg[0] });
          }
        });
      }
    },
    () => {
      setIsModalOpen(false);
      setEditingUser(null);
    }
  );

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  // Guard after hooks
  if (currentUser && !canAccessUsers(currentUser)) {
    return (
      <div className="min-h-screen bg-moto-bg text-moto-text flex">
        <CmsSidebar role={roleMode} onRoleChange={setRoleMode} />
        <div className="flex-1 flex flex-col min-w-0">
          <CmsHeader title="Access Denied" role={roleMode} />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="bg-moto-surface border border-moto-border p-8 rounded max-w-md text-center space-y-4">
              <div className="text-moto-apex font-mono text-sm uppercase tracking-widest">403 Forbidden</div>
              <h2 className="text-xl font-bold font-barlow uppercase">Restricted Access</h2>
              <p className="text-xs text-moto-muted">
                User management is restricted to administrators. You do not have permission to view or manage user accounts.
              </p>
            </div>
          </main>
          <CmsFooter />
        </div>
      </div>
    );
  }

  const handleOpenAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data: UserFormData) => {
    if (editingUser) {
      updateUser(data);
    } else {
      createUser(data);
    }
  };

  return (
    <div className="min-h-screen bg-moto-bg text-moto-text flex">
      <CmsSidebar role={roleMode} onRoleChange={setRoleMode} />

      <div className="flex-1 flex flex-col min-w-0">
        <CmsHeader title="User Accounts & Role Management" role={roleMode} />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-wider font-barlow uppercase text-moto-text">Users Management</h1>
              <p className="text-xs text-moto-muted mt-1">Manage administrator and data entry accounts, roles, and brand scopes.</p>
            </div>
            <Button variant="primary" onClick={handleOpenAdd}>
              + Add User Account
            </Button>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-moto-surface p-4 rounded border border-moto-border">
            <div className="w-full sm:w-72">
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                options={[
                  { label: "All Roles", value: "All" },
                  { label: "Administrator", value: "admin" },
                  { label: "Data Entry", value: "data_entry" },
                ]}
              />
            </div>
          </div>

          <UsersTable
            users={users}
            isLoading={isLoadingUsers}
            currentUserId={currentUser?.id}
            onEdit={handleOpenEdit}
            onDelete={(id) => setDeletingId(id)}
          />

          {/* Create / Edit Modal */}
          <Dialog
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={editingUser ? `Edit User: ${editingUser.name}` : "Create New User Account"}
          >
            <UserForm
              formRef={formRef}
              initialData={editingUser}
              currentUserId={currentUser?.id}
              brands={brands}
              onSubmit={handleFormSubmit}
              isPending={isCreating || isUpdating}
              onCancel={() => setIsModalOpen(false)}
              setErrorRef={(fn) => {
                setErrorRef.current = fn;
              }}
            />
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog
            isOpen={deletingId !== null}
            onClose={() => setDeletingId(null)}
            title="Confirm User Deletion"
          >
            <div className="space-y-4">
              <p className="text-sm text-moto-muted">
                Are you sure you want to delete this user account? Their tokens will be revoked immediately and this action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-moto-border">
                <Button variant="outline" onClick={() => setDeletingId(null)} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (deletingId !== null) {
                      deleteUser(deletingId, {
                        onSuccess: () => setDeletingId(null),
                      });
                    }
                  }}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete User"}
                </Button>
              </div>
            </div>
          </Dialog>
        </main>

        <CmsFooter />
      </div>
    </div>
  );
}
