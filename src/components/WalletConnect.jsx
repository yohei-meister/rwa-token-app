import { XummPkce } from "xumm-oauth2-pkce";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const xumm = new XummPkce(import.meta.env.VITE_XUMM_API_KEY);

export default function WalletConnect({ onAddressClick }) {
  const [address, setAddress] = useState("");

  // Initialize wallet state on component mount
  useEffect(() => {
    const initWallet = async () => {
      try {
        const state = await xumm.state();
        if (state.me?.account) {
          setAddress(state.me.account);
        }
      } catch (error) {
        console.error("Error initializing wallet:", error);
      }
    };
    initWallet();
  }, []);

  const handleLogin = async () => {
    try {
      // Force logout before connecting to ensure QR code scan
      await xumm.logout();
      // Clear any stored state
      localStorage.removeItem("xumm-auth");
      localStorage.removeItem("xumm-state");
      setAddress("");

      // Now authorize with fresh state
      await xumm.authorize();
      const state = await xumm.state();
      setAddress(state.me?.account);
      toast.success(`Wallet connected: ${state.me?.account}`);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
    }
  };

  const handleLogout = async () => {
    try {
      await xumm.logout();
      // Clear the stored tokens and state
      localStorage.removeItem("xumm-auth");
      localStorage.removeItem("xumm-state");
      setAddress("");
      toast.success("Wallet disconnected");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.error("Failed to disconnect wallet");
    }
  };

  return (
    <div>
      {!address ? (
        <button
          onClick={handleLogin}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <div className="text-gray-800">
            Connected Wallet:{" "}
            <button
              className="text-blue-600 underline break-all hover:text-blue-800 focus:outline-none"
              onClick={() => onAddressClick && onAddressClick(address)}
              style={{
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: 0
              }}
              tabIndex={0}
            >
              <strong>{address}</strong>
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
}
