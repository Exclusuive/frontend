import { Role } from "@/types/user";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  address: string;
  role: string;
  profile: {
    name: string;
    imgUrl: string;
    age: number;
    sex: string;
    email: string;
    location: string;
    birthDate: string;
    plan: string;
  };
}

interface AuthState {
  user: User | null;
  login: (address: string, role: string) => boolean;
  logout: () => void;
  setRole: (role: Role) => void;
  updateProfile: (profileData: Partial<User["profile"]>) => void;
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
              imgUrl: "https://github.com/twbs.png",
              age: 20,
              sex: "male",
              email: "test@test.com",
              location: "test",
              birthDate: "2025-01-01",
              plan: "free",
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
      setRole: (role: Role) => {
        set((state) => (state.user ? { user: { ...state.user, role: role.id } } : state));
      },
      updateProfile: (profileData: Partial<User["profile"]>) => {
        set((state) =>
          state.user
            ? {
                user: {
                  ...state.user,
                  profile: {
                    ...state.user.profile,
                    ...profileData,
                  },
                },
              }
            : state,
        );
      },
    }),
    {
      name: "auth-storage", // name of the item in the storage
      storage: createJSONStorage(() => localStorage), // use localStorage
    },
  ),
);
