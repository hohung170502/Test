import { create } from "zustand";

interface User {
 username: string;
  email: string;
  avatar: string;
  roles?: string[];
  verified?: boolean;
  phonenumber?: string;
  address?: string;
  gender?: string;
  birthday?: string;
  createdAt?: string; 
  updatedAt?: string; 
  isOnline?: boolean; 
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
