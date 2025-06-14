import { useWallet } from "../hooks/useWallet";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function WalletConnect({
  onAddressClick,
  onConnectionChange,
  onDisconnect
}) {
  const { address, isConnected, connect, disconnect } = useWallet();

  // Notify parent component of connection changes
  useEffect(() => {
    onConnectionChange?.(isConnected);
  }, [isConnected, onConnectionChange]);

  const handleDisconnect = async () => {
    await disconnect();
    onConnectionChange?.(false);
    if (onDisconnect) onDisconnect();
  };

  return (
    <div>
      {!address ? (
        <button
          onClick={connect}
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
            onClick={handleDisconnect}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
}
