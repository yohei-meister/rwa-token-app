"use client";

import { isInstalled, getAddress } from "@gemwallet/api";
import { Button } from "@/components/ui/button";

export function WalletConnectButton() {
  const handleConnect = async () => {
    try {
      isInstalled().then((response) => {
        if (response.result.isInstalled) {
          getAddress().then((response) => {
            console.log(`Your address: ${response.result?.address}`);
          });
        } else {
          throw new Error("Gemwallet is not installed");
        }
      });
    } catch (error) {
      console.error("Error connecting: ", error);
    }
  };

  return <Button onClick={handleConnect}>Connect</Button>;
}
