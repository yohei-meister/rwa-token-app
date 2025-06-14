import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SendModal from "../components/SendModal";
import { toast } from "react-hot-toast";
import { useFund } from "../contexts/FundContext";
import WalletConnect from "../components/WalletConnect";
import WalletInfoModal from "../components/WalletInfoModal";

export default function FundDetail() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { funds } = useFund();
  const fund = funds.find((f) => f.symbol === symbol);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Handle wallet disconnect and redirect to Home
  const handleDisconnect = () => {
    navigate("/");
    //after redirecting to home I want to disconnect from wallet automatically
    // Delay the disconnect to ensure navigation completes first
    setTimeout(() => {
      const walletConnect = document.querySelector(
        'button[class*="bg-orange-500"]'
      );
      if (walletConnect) {
        walletConnect.click();
        toast.dismiss(); // Dismiss any existing toasts
      }
    }, 100);
  };

  if (!fund) {
    toast.error("Fund not found");
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <WalletInfoModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar: Back to Home and WalletConnect */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            &larr; Back to Home
          </button>
          <WalletConnect
            onAddressClick={() => setIsWalletModalOpen(true)}
            onDisconnect={handleDisconnect}
          />
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {fund.name}
                </h1>
                <p className="mt-1 text-sm text-gray-500">{fund.symbol}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Invest Now
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {fund.category}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Total AUM</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {fund.totalAUM}
                </p>
              </div>
            </div>

            <br />

            {/* Highlighted Token Price and Available Tokens */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-6 flex flex-col items-center justify-center">
                <span className="text-lg font-semibold text-blue-700">
                  Token Price
                </span>
                <span className="text-3xl font-bold text-blue-900 mt-1">
                  {fund.tokenPrice} XRP
                </span>
              </div>
              <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col items-center justify-center">
                <span className="text-lg font-semibold text-green-700">
                  Available Tokens
                </span>
                <span className="text-3xl font-bold text-green-900 mt-1">
                  {fund.availableUnits}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Description</h3>
              <p className="mt-2 text-gray-500">{fund.description}</p>
            </div>
          </div>
        </div>
      </div>

      <SendModal
        key={fund.id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        symbol={fund.symbol}
        fundId={fund.id}
      />
    </div>
  );
}
