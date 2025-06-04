import { XummPkce } from "xumm-oauth2-pkce";
import { useEffect, useState } from "react";

const xumm = new XummPkce(import.meta.env.VITE_XUMM_API_KEY);

export default function WalletConnect() {
  const [address, setAddress] = useState("");

  const handleLogin = async () => {
    await xumm.authorize();
    const state = await xumm.state();
    setAddress(state.me?.account);
  };

  return (
    <div>
      <button
        onClick={handleLogin}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Connect Wallet
      </button>

      {address && (
        <div className="mt-4 text-gray-800">
          Connected Wallet: <strong>{address}</strong>
        </div>
      )}
    </div>
  );
}
