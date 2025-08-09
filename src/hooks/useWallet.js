import { useState, useEffect } from "react";
import { XummPkce } from "xumm-oauth2-pkce";
import toast from "react-hot-toast";

// デバッグ用: 環境変数の確認
console.log("VITE_XUMM_API_KEY:", import.meta.env.VITE_XUMM_API_KEY);
console.log("VITE_XUMM_REDIRECT_URL:", import.meta.env.VITE_XUMM_REDIRECT_URL);
console.log("Environment:", import.meta.env.MODE);
console.log("All env vars:", import.meta.env);

// XUMMインスタンスを動的に作成する関数
const createXummInstance = () => {
  const apiKey = import.meta.env.VITE_XUMM_API_KEY;
  const redirectUri = import.meta.env.VITE_XUMM_REDIRECT_URL;
  
  console.log("Creating XUMM instance with:", { apiKey, redirectUri });
  
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
        console.log("XUMM state:", state); // デバッグ用

        if (state && state.me?.account) {
          setAddress(state.me.account);
          setIsConnected(true);
        } else {
          console.log("No active XUMM session found");
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
      console.log("Starting XUMM authorization...");
      console.log("Current URL:", window.location.href);
      console.log("Redirect URI:", import.meta.env.VITE_XUMM_REDIRECT_URL);

      await xumm.logout();
      localStorage.removeItem("xumm-auth");
      localStorage.removeItem("xumm-state");
      setAddress("");
      setIsConnected(false);

      console.log("About to call xumm.authorize()...");
      await xumm.authorize();
      console.log("xumm.authorize() completed");

      const state = await xumm.state();
      console.log("Authorization completed, state:", state);

      if (state && state.me?.account) {
        setAddress(state.me.account);
        setIsConnected(true);
        toast.success(`Wallet connected: ${state.me.account}`);
      } else {
        throw new Error(
          "Failed to get account information after authorization"
        );
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
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
    disconnect
  };
}
