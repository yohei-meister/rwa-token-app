import { useState } from "react";
import "./App.css";
import React from "react";
import TokenCard from "./components/TokenCard";
import WalletConnect from "./components/WalletConnect";
import { funds } from "./data/funds";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Available Fund Tokens</h1>
          <WalletConnect />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {funds.map((token) => (
            <TokenCard key={token.symbol} {...token} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
