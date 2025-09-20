import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/data/users";

interface WalletState {
  selectedUser: User | null;
  isConnected: boolean;
}

interface WalletActions {
  selectUser: (user: User) => void;
  disconnect: () => void;
}

type WalletStore = WalletState & WalletActions;

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      // State
      selectedUser: null,
      isConnected: false,

      // Actions
      selectUser: (user: User) => {
        set({
          selectedUser: user,
          isConnected: true,
        });
      },

      disconnect: () => {
        set({
          selectedUser: null,
          isConnected: false,
        });
      },
    }),
    {
      name: "wallet-storage", // ローカルストレージのキー名
      partialize: (state) => ({
        // 永続化する状態を指定
        selectedUser: state.selectedUser,
        isConnected: state.isConnected,
      }),
    },
  ),
);
