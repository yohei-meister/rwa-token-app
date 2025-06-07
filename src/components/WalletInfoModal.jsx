import React, { useEffect, useState } from "react";
import { useFund } from "../contexts/FundContext";

export default function WalletInfoModal({ isOpen, onClose }) {
  const { funds } = useFund();
  const [xrpBalance, setXrpBalance] = useState(null);
  const [tokenBalances, setTokenBalances] = useState({});

  // Placeholder: Replace with actual logic to fetch balances
  useEffect(() => {
    if (!isOpen) return;
    // Simulate async fetch
    setTimeout(() => {
      setXrpBalance("123.45"); // Replace with real XRP balance
      setTokenBalances({
        FDA: 10,
        FDB: 5,
        FDC: 0
      });
    }, 500);
  }, [isOpen]);

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
            {xrpBalance !== null ? `${xrpBalance} XRP` : "..."}
          </div>
        </div>
        <div>
          <div className="text-lg font-semibold mb-2">Token Balances</div>
          <ul>
            {funds.map((fund) => (
              <li key={fund.tokenSymbol} className="flex justify-between py-1">
                <span>{fund.tokenSymbol}</span>
                <span className="font-mono">
                  {tokenBalances[fund.tokenSymbol] ?? "..."}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
