import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  address: string;
  role: string;
}

interface AuthState {
  user: User | null;
  login: (address: string, role: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (address, role) => {
        set({
          user: {
            address: address,
            role: role,
          },
        });
        return true;
      },
      logout: () => {
        set({
          user: null,
        });
      },
    }),
    {
      name: "auth-storage", // name of the item in the storage
      storage: createJSONStorage(() => localStorage), // use localStorage
    },
  ),
);
