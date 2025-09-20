import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isInstalled, getAddress } from "@gemwallet/api";

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
}

interface WalletActions {
  connect: () => Promise<void>;
  disconnect: () => void;
}

type WalletStore = WalletState & WalletActions;

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      // State
      address: null,
      isConnected: false,
      isLoading: false,

      // Actions
      connect: async () => {
        set({ isLoading: true });

        try {
          const installedResponse = await isInstalled();

          if (!installedResponse.result.isInstalled) {
            throw new Error("Gemwallet is not installed");
          }

          const addressResponse = await getAddress();

          if (addressResponse.result?.address) {
            set({
              address: addressResponse.result.address,
              isConnected: true,
              isLoading: false,
            });
          } else {
            throw new Error("Failed to get wallet address");
          }
        } catch (error) {
          console.error("Wallet connection error:", error);
          set({
            address: null,
            isConnected: false,
            isLoading: false,
          });
        }
      },

      disconnect: () => {
        set({
          address: null,
          isConnected: false,
          isLoading: false,
        });
      },
    }),
    {
      name: "wallet-storage", // ローカルストレージのキー名
      partialize: (state) => ({
        // 永続化する状態を指定（isLoadingは永続化しない）
        address: state.address,
        isConnected: state.isConnected,
      }),
      onRehydrateStorage: () => (state) => {
        // ストレージから復元後の処理
        if (state) {
          // 復元時はローディング状態をリセット
          state.isLoading = false;
        }
      },
    }
  )
);
