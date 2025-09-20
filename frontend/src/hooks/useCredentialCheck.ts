import { Client, type AccountObjectsRequest, Wallet } from "xrpl";
import { xrplConfig } from "@/config/xrpl";
import { useQuery } from "@tanstack/react-query";
import { useWalletStore } from "@/stores/walletStore";

export const useCredentialCheck = (account: string) => {
  const { selectedUser } = useWalletStore();

  return useQuery({
    queryKey: ["credential_check", account],
    queryFn: async () => {
      const wallet = Wallet.fromSecret(selectedUser?.seed || "");

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      const client = new Client(xrplConfig.wss.dev);
      try {
        await client.connect();

        const request: AccountObjectsRequest = {
          command: "account_objects",
          account: account,
        }

        const response = await client.request(request);
        return response;
      } catch (error) {
        console.error(error);
      }
    },
  });
};
