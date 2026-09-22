"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { UserProfile } from "@/types";
import {
  getUser,
  signInDemo,
  signOut as storeSignOut,
  updateUser,
} from "@/lib/data/store";
import { isShabbatNow } from "@/lib/shabbat/status";

interface AuthContextValue {
  user: UserProfile | null;
  signedIn: boolean;
  shabbatLocked: boolean;
  signIn: () => void;
  signOut: () => void;
  patchUser: (patch: Partial<UserProfile>) => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => {
    setUser(getUser());
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const shabbatLocked = useMemo(() => {
    if (!user?.shabbatMode) return false;
    return isShabbatNow(user.lat ?? 31.7683, user.lng ?? 35.2137);
  }, [user, tick]);

  const value: AuthContextValue = {
    user,
    signedIn: !!user,
    shabbatLocked,
    signIn: () => {
      setUser(signInDemo());
    },
    signOut: () => {
      storeSignOut();
      setUser(null);
    },
    patchUser: (patch) => {
      const next = updateUser(patch);
      setUser(next);
    },
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
