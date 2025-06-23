import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  address: string;
  role: string;
  profile: {
    name: string;
    avatar: string;
    age: number;
    sex: string;
  };
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
            profile: {
              name: "John Doe",
              avatar: "https://github.com/twbs.png",
              age: 20,
              sex: "male",
            },
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
      setRole: (role: string) => {
        set((state) => (state.user ? { user: { ...state.user, role } } : state));
      },
    }),
    {
      name: "auth-storage", // name of the item in the storage
      storage: createJSONStorage(() => localStorage), // use localStorage
    },
  ),
);
