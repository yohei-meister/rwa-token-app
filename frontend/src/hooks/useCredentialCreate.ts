import { useMutation } from "@tanstack/react-query";
import { Client, type CredentialCreate, Wallet } from "xrpl";
import { xrplConfig } from "@/config/xrpl";
import { useWalletStore } from "@/stores/walletStore";

// 文字列を16進数にエンコードするヘルパー関数
const stringToHex = (str: string): string => {
  return Buffer.from(str, "utf8").toString("hex").toUpperCase();
};

export const useCredentialCreate = () => {
  const { selectedUser } = useWalletStore();

  return useMutation({
    mutationFn: async ({ input }: { input: CredentialCreate }) => {
      const wallet = Wallet.fromSecret(selectedUser?.seed || "");

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      const encodedInput = {
        ...input,
        CredentialType: stringToHex(input.CredentialType as string),
      };

      const client = new Client(xrplConfig.wss.dev);
      try {
        await client.connect();
        const response = await client.submitAndWait(encodedInput, {
          wallet,
          autofill: true,
        });
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        await client.disconnect();
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
