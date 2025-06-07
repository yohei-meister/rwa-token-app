import React, { useEffect, useState } from "react";
import { useFund } from "../contexts/FundContext";
import { Client } from "xrpl";

const TESTNET_URL = "wss://s.altnet.rippletest.net:51233";

export default function WalletInfoModal({ isOpen, onClose }) {
  const { funds } = useFund();
  const [xrpBalance, setXrpBalance] = useState(null);
  const [tokenBalances, setTokenBalances] = useState({});
  const [loading, setLoading] = useState(false);
  const destinationAddress = import.meta.env.VITE_XRPL_DESTINATION_ADDRESS;

  useEffect(() => {
    if (!isOpen) return;
    let client;
    setLoading(true);
    setXrpBalance(null);
    setTokenBalances({});

    async function fetchBalances() {
      try {
        client = new Client(TESTNET_URL);
        await client.connect();
        // Fetch XRP balance
        const accountInfo = await client.request({
          command: "account_info",
          account: destinationAddress,
          ledger_index: "validated"
        });
        setXrpBalance(
          (Number(accountInfo.result.account_data.Balance) / 1_000_000).toFixed(
            6
          )
        );
        // Fetch token balances
        const lines = await client.request({
          command: "account_lines",
          account: destinationAddress
        });
        const balances = {};
        for (const fund of funds) {
          const line = lines.result.lines.find(
            (l) => l.currency === fund.tokenSymbol
          );
          balances[fund.tokenSymbol] = line ? line.balance : "0";
        }
        setTokenBalances(balances);
      } catch (e) {
        setXrpBalance("Error");
        setTokenBalances({});
      } finally {
        setLoading(false);
        if (client && client.isConnected()) await client.disconnect();
      }
    }
    fetchBalances();
    // Cleanup on close
    return () => {
      if (client && client.isConnected()) client.disconnect();
    };
  }, [isOpen, destinationAddress, funds]);

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
              ? "..."
              : xrpBalance !== null
              ? `${xrpBalance} XRP`
              : "..."}
          </div>
        </div>
        <div>
          <div className="text-lg font-semibold mb-2">Token Balances</div>
          <ul>
            {funds.map((fund) => (
              <li key={fund.symbol} className="flex justify-between py-1">
                <span>{fund.symbol}</span>
                <span className="font-mono">
                  {loading ? "..." : tokenBalances[fund.tokenSymbol] ?? "0"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
