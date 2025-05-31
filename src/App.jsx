import { useState } from "react";
import "./App.css";
import React from "react";

import TokenCard from "./TokenCard";

const tokens = [
  { name: "Private Equity Fund A", symbol: "FUND-A", balance: 100, nav: 1200 },
  { name: "Private Equity Fund B", symbol: "FUND-B", balance: 50, nav: 980 },
  { name: "Private Equity Fund C", symbol: "FUND-C", balance: 150, nav: 1050 }
];

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Available Fund Tokens</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tokens.map((token) => (
          <TokenCard key={token.symbol} {...token} />
        ))}
      </div>
    </div>
  );
}

export default App;
