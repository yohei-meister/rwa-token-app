import React, { useEffect, useState } from "react";
import { useFund } from "../contexts/FundContext";
import { useXRPLClient } from "../hooks/useXRPLClient";
import { getAccountBalances } from "../utils/xrplTransactions";
import toast from "react-hot-toast";

export default function WalletInfoModal({ isOpen, onClose }) {
  const { funds } = useFund();
  const { client } = useXRPLClient();
  const [xrpBalance, setXrpBalance] = useState(null);
  const [tokenBalances, setTokenBalances] = useState({});
  const [loading, setLoading] = useState(false);
  const destinationAddress = import.meta.env.VITE_XRPL_DESTINATION_ADDRESS;

  useEffect(() => {
    if (!isOpen || !client || !destinationAddress) return;

    const fetchBalances = async () => {
      setLoading(true);
      setXrpBalance(null);
      setTokenBalances({});

      try {
        if (client.connect) await client.connect();
        const { xrpBalance, tokenBalances: lines } = await getAccountBalances(
          client,
          destinationAddress
        );
        setXrpBalance(Number(xrpBalance).toFixed(6));
        const balances = {};
        for (const fund of funds) {
          const line = lines.find((l) => l.currency === fund.tokenSymbol);
          balances[fund.tokenSymbol] = line
            ? Math.floor(Number(line.balance)).toString()
            : "0";
        }
        setTokenBalances(balances);
      } catch (error) {
        setXrpBalance("Error");
        setTokenBalances({});
        toast.error("Failed to fetch wallet balances");
      } finally {
        setLoading(false);
        if (client.disconnect) await client.disconnect();
      }
    };

    fetchBalances();
  }, [isOpen, client, destinationAddress, funds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-md w-full z-10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <span className="sr-only">Close</span>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Wallet Balances</h2>
        <div className="mb-4">
          <div className="text-lg font-semibold">XRP Balance</div>
          <div className="text-2xl text-blue-700 font-bold">
            {loading
              ? "Fetching Balance..."
              : xrpBalance !== null
              ? `${xrpBalance} XRP`
              : "Fetching Balance..."}
          </div>
        </div>
        <div>
          <div className="text-lg font-semibold mb-2">Token Balances</div>
          <ul>
            {funds.map((fund) => (
              <li key={fund.symbol} className="flex justify-between py-1">
                <span>{fund.symbol}</span>
                <span className="font-mono">
                  {loading
                    ? "Fetching Balance..."
                    : tokenBalances[fund.tokenSymbol] ?? "0"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
