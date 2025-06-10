import { useFund } from "../contexts/FundContext";
import TokenCard from "../components/TokenCard";
import WalletConnect from "../components/WalletConnect";
import { useState } from "react";
import WalletInfoModal from "../components/WalletInfoModal";

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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold">Available Fund Tokens</h1>
          <WalletConnect
            onAddressClick={() => setIsWalletModalOpen(true)}
            onConnectionChange={setIsWalletConnected}
          />
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
