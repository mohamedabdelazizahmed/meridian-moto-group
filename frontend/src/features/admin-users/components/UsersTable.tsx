"use client";

import type { User } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/site/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/date";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  currentUserId?: number | string;
  onEdit: (user: User) => void;
  onDelete: (id: number | string) => void;
}

export function UsersTable({ users, isLoading, currentUserId, onEdit, onDelete }: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded bg-moto-surface" />
        ))}
      </div>
    );
  }

  if (!users || users.length === 0) {
    return <EmptyState message="No user accounts match your search or filter criteria." />;
  }

  return (
    <div className="overflow-x-auto rounded border border-moto-border bg-moto-surface">
      <table className="w-full text-left text-xs">
        <thead className="bg-moto-bg text-moto-muted uppercase font-mono tracking-wider border-b border-moto-border">
          <tr>
            <th className="p-3.5">User Details</th>
            <th className="p-3.5">Role</th>
            <th className="p-3.5">Assigned Brands</th>
            <th className="p-3.5">Created Date</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-moto-border/60">
          {users.map((user) => {
            const isSelf = currentUserId && String(user.id) === String(currentUserId);
            return (
              <tr key={user.id} className="hover:bg-moto-bg/40 transition-colors">
                <td className="p-3.5">
                  <div className="font-semibold text-moto-text text-sm flex items-center gap-2">
                    {user.name}
                    {isSelf && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-moto-copper/20 text-moto-copper font-mono">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-moto-muted font-mono text-[11px]">{user.email}</div>
                </td>
                <td className="p-3.5">
                  <Badge
                    variant={user.role === "admin" ? "warning" : "default"}
                    className="uppercase font-mono text-[10px]"
                  >
                    {user.role === "admin" ? "Administrator" : "Data Entry"}
                  </Badge>
                </td>
                <td className="p-3.5">
                  {user.role === "admin" ? (
                    <span className="text-moto-muted font-mono text-[11px] italic">All 4 Marques</span>
                  ) : user.brands && user.brands.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {user.brands.map((b) => (
                        <span
                          key={b.id || b.slug || b.name}
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-medium border"
                          style={{
                            borderColor: b.accent_color ? `${b.accent_color}50` : undefined,
                            backgroundColor: b.accent_color ? `${b.accent_color}15` : undefined,
                            color: b.accent_color || undefined,
                          }}
                        >
                          {b.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-moto-muted font-mono text-[11px] italic">None</span>
                  )}
                </td>
                <td className="p-3.5 font-mono text-[11px] text-moto-muted">
                  {user.created_at ? formatDate(user.created_at) : "—"}
                </td>
                <td className="p-3.5 text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={Boolean(isSelf)}
                    title={isSelf ? "You cannot delete your own account." : undefined}
                    onClick={() => {
                      if (user.id !== undefined) {
                        onDelete(user.id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
