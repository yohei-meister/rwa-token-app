import { XummPkce } from "xumm-oauth2-pkce";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Using a public API key for XUMM OAuth2
const xumm = new XummPkce("11757c9e-b76d-46b4-9a5f-f4b51c97bbdd");

export default function WalletConnect({ onAddressClick, onConnectionChange }) {
  const [address, setAddress] = useState("");

  // Initialize wallet state on component mount
  useEffect(() => {
    const initWallet = async () => {
      try {
        const state = await xumm.state();
        if (state.me?.account) {
          setAddress(state.me.account);
          onConnectionChange?.(true);
        } else {
          onConnectionChange?.(false);
        }
      } catch (error) {
        console.error("Error initializing wallet:", error);
        onConnectionChange?.(false);
      }
    };
    initWallet();
  }, [onConnectionChange]);

  const handleLogin = async () => {
    try {
      // Force logout before connecting to ensure QR code scan
      await xumm.logout();
      // Clear any stored state
      localStorage.removeItem("xumm-auth");
      localStorage.removeItem("xumm-state");
      setAddress("");
      onConnectionChange?.(false);

      // Now authorize with fresh state
      await xumm.authorize();
      const state = await xumm.state();
      setAddress(state.me?.account);
      onConnectionChange?.(true);
      toast.success(`Wallet connected: ${state.me?.account}`);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
      onConnectionChange?.(false);
    }
  };

  const handleLogout = async () => {
    try {
      await xumm.logout();
      // Clear the stored tokens and state
      localStorage.removeItem("xumm-auth");
      localStorage.removeItem("xumm-state");
      setAddress("");
      onConnectionChange?.(false);
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
