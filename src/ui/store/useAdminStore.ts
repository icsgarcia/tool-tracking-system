import { create } from "zustand";

type AdminState = {
    admin: User | null;
    login: (user: User) => void;
    logout: () => void;
};

export const useAdminStore = create<AdminState>()((set) => ({
    admin: null,
    login: (user) => set({ admin: user }),
    logout: () => set({ admin: null }),
}));
