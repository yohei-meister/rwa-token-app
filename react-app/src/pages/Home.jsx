import { useState } from "react";
import TokenCard from "../components/TokenCard";
import WalletConnect from "../components/WalletConnect";
import WalletInfoModal from "../components/WalletInfoModal";
import { useFund } from "../contexts/FundContext";

export default function Home() {
  const { funds } = useFund();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-16">
      <WalletInfoModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-16">
          <div className="w-full sm:w-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              RWA Fund Token Marketplace
            </h1>
            <p className="mt-2 text-2xl text-gray-600">
              Discover and invest in tokenized private equity funds and
              real-world assets
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <WalletConnect
              onAddressClick={() => setIsWalletModalOpen(true)}
              onConnectionChange={setIsWalletConnected}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {funds.map((token) => (
            <TokenCard
              key={token.symbol}
              {...token}
              showCategoryAUMOnly
              isWalletConnected={isWalletConnected}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
