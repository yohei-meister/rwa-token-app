import { useState, useEffect } from "react";
import { XummPkce } from "xumm-oauth2-pkce";
import toast from "react-hot-toast";

const xumm = new XummPkce("11757c9e-b76d-46b4-9a5f-f4b51c97bbdd");

export function useWallet() {
  const [address, setAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initWallet = async () => {
      try {
        const state = await xumm.state();
        if (state.me?.account) {
          setAddress(state.me.account);
          setIsConnected(true);
        } else {
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
      await xumm.logout();
      localStorage.removeItem("xumm-auth");
      localStorage.removeItem("xumm-state");
      setAddress("");
      setIsConnected(false);

      await xumm.authorize();
      const state = await xumm.state();
      setAddress(state.me?.account);
      setIsConnected(true);
      toast.success(`Wallet connected: ${state.me?.account}`);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
      setIsConnected(false);
    }
  };

  const disconnect = async () => {
    try {
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
