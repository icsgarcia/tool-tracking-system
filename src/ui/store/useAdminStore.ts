import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AdminState = {
    admin: User | null;
    login: (user: User) => void;
    logout: () => void;
};

export const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            admin: null,
            login: (user) => set({ admin: user }),
            logout: () => set({ admin: null }),
        }),
        {
            name: "admin-storage",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
