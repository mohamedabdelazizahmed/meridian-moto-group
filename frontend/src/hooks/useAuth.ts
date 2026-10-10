import { useAuthStore } from "@/store/auth.store";
import { isAdmin, isDataEntry, canManageBrand as checkCanManageBrand, canAccessUsers as checkCanAccessUsers } from "@/lib/roles";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clear = useAuthStore((state) => state.clear);

  return {
    user,
    setUser,
    clear,
    role: user?.role ?? null,
    brands: user?.brands ?? [],
    isAuthenticated: !!user,
    isAdmin: isAdmin(user),
    isDataEntry: isDataEntry(user),
    canManageBrand: (brandId: string | number) => checkCanManageBrand(user, brandId),
    canAccessUsers: checkCanAccessUsers(user),
  };
}
