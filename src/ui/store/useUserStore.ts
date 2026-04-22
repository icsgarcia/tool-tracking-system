import { create } from "zustand";

type UserStore = {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
};

export const useUserStore = create<UserStore>()((set) => ({
    user: null,
    login: (user: User) => set({ user: user }),
    logout: () => set({ user: null }),
}));
