import { create } from "zustand";

interface NameStore {
	name: string;
	addName: (name: string) => void;
	clear: () => void;
}

export const useNameStore = create<NameStore>((set) => ({
	name: "",
	addName: (name) => set({ name }),
	clear: () => set({ name: "" }),
}));
