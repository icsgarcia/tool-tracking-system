import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserStore = {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
};

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            login: (user: User) => set({ user: user }),
            logout: () => set({ user: null }),
        }),
        {
            name: "user-storage",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
