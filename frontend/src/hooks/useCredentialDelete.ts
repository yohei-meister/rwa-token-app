import { useMutation } from "@tanstack/react-query";
import { Client, type CredentialDelete, Wallet } from "xrpl";
import { xrplConfig } from "@/config/xrpl";
import { useWalletStore } from "@/stores/walletStore";

export const useCredentialDelete = () => {
  const { selectedUser } = useWalletStore();

  return useMutation({
    mutationFn: async ({ input }: { input: CredentialDelete }) => {
      const wallet = Wallet.fromSecret(selectedUser?.seed || "");

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      const client = new Client(xrplConfig.wss.dev);
      try {
        await client.connect();
        const response = await client.submitAndWait(input, {
          wallet,
          autofill: true,
        });
        return response;
      } catch (error) {
        console.error(error);
      }
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
