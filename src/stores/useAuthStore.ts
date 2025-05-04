import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  email: string;
  userId: string;
}

interface AuthState {
  veginUserIsLogin: boolean;
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// Dummy user data
const DUMMY_USER = {
  email: "example@naver.com",
  password: "123456",
  userId: "user123",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      veginUserIsLogin: false,
      user: null,
      login: (email, password) => {
        // Check against dummy credentials
        if (email === DUMMY_USER.email && password === DUMMY_USER.password) {
          set({
            veginUserIsLogin: true,
            user: {
              email: DUMMY_USER.email,
              userId: DUMMY_USER.userId,
            },
          });
          return true;
        }
        return false;
      },
      logout: () => {
        set({
          veginUserIsLogin: false,
          user: null,
        });
      },
    }),
    {
      name: "vegin-auth-storage", // name of the item in the storage
      storage: createJSONStorage(() => localStorage), // use localStorage
    },
  ),
);
