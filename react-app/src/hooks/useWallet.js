import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { XummPkce } from "xumm-oauth2-pkce";

// XUMM configuration

// XUMMインスタンスを動的に作成する関数
const createXummInstance = () => {
  const apiKey = import.meta.env.VITE_XUMM_API_KEY;
  const redirectUri = import.meta.env.VITE_XUMM_REDIRECT_URL;

  // Create XUMM instance with environment variables

  if (!apiKey) {
    throw new Error("VITE_XUMM_API_KEY is not defined");
  }
  if (!redirectUri) {
    throw new Error("VITE_XUMM_REDIRECT_URL is not defined");
  }

  return new XummPkce(apiKey, { redirectUri });
};

export function useWallet() {
  const [address, setAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initWallet = async () => {
      try {
        const xumm = createXummInstance();
        const state = await xumm.state();
        // Check XUMM authentication state

        if (state?.me?.account) {
          setAddress(state.me.account);
          setIsConnected(true);
        } else {
          // No active session found
          setIsConnected(false);
        }
      } catch (error) {
        console.error("Error initializing wallet:", error);
        setIsConnected(false);
      }
    };
    initWallet();
  }, []);

  const connect = async () => {
    try {
      const xumm = createXummInstance();
      // Start XUMM authorization process

      await xumm.logout();
      localStorage.removeItem("xumm-auth");
      localStorage.removeItem("xumm-state");
      setAddress("");
      setIsConnected(false);

      await xumm.authorize();
      const state = await xumm.state();

      if (state?.me?.account) {
        setAddress(state.me.account);
        setIsConnected(true);
        toast.success(`Wallet connected: ${state.me.account}`);
      } else {
        throw new Error(
          "Failed to get account information after authorization",
        );
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      // Log error details for debugging
      toast.error("Failed to connect wallet");
      setIsConnected(false);
    }
  };

  const disconnect = async () => {
    try {
      const xumm = createXummInstance();
      await xumm.logout();
      localStorage.removeItem("xumm-auth");
      localStorage.removeItem("xumm-state");
      setAddress("");
      setIsConnected(false);
      toast.success("Wallet disconnected");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.error("Failed to disconnect wallet");
    }
  };

  return {
    address,
    isConnected,
    connect,
    disconnect,
  };
}
