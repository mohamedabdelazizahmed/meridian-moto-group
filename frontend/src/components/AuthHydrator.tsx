"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import type { AuthUser } from "@/types/api";

interface AuthHydratorProps {
  user: AuthUser;
  children: React.ReactNode;
}

export default function AuthHydrator({ user, children }: AuthHydratorProps) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return <>{children}</>;
}
