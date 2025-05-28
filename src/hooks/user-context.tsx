"use client";
import { Session } from "@/app/(auth)/lib/session";
import React, { createContext, useContext, useState } from "react";

type User = {
  email: string;
  username: string;
  avatar: string;
  roles?: string[];
  verified?: boolean;
};

const UserContext = createContext<{
  user: User | null;
  setUser: (user: User) => void;
}>({
  user: null,
  setUser: () => {},
});

export const useUser = () => useContext(UserContext);

export function UserProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null; // 👈 Cho phép null
}) {
  const [user, setUser] = useState<User | null>(session?.user ?? null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
