import { useMutation } from "@tanstack/react-query";
import { Client, type Transaction, Wallet } from "xrpl";
import { xrplConfig } from "@/config/xrpl";
import { useWalletStore } from "@/stores/walletStore";

// 文字列を16進数にエンコードするヘルパー関数
const stringToHex = (str: string): string => {
  return Buffer.from(str, "utf8").toString("hex").toUpperCase();
};

export const useCredentialDelete = () => {
  const { selectedUser } = useWalletStore();

  return useMutation({
    mutationFn: async ({
      input,
    }: {
      input: { Issuer: string; Subject: string; CredentialType: string };
    }) => {
      const wallet = Wallet.fromSecret(selectedUser?.seed || "");

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      const tx: Transaction = {
        TransactionType: "CredentialDelete",
        Account: wallet.address, // 本人が署名/送信
        Issuer: input.Issuer,
        Subject: input.Subject,
        CredentialType: stringToHex(input.CredentialType),
      };

      const client = new Client(xrplConfig.wss.dev);
      try {
        await client.connect();
        const prepared = await client.autofill(tx);
        const signed = wallet.sign(prepared);
        const response = await client.submitAndWait(signed.tx_blob);
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
