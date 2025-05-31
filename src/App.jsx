import { useState } from "react";
import "./App.css";
import React from "react";

import TokenCard from "./components/TokenCard";

const tokens = [
  {
    name: "Private Equity Fund A",
    symbol: "FUND-A",
    availableUnits: 100,
    totalAUM: "USD 50Mil"
  },
  {
    name: "Private Equity Fund B",
    symbol: "FUND-B",
    availableUnits: 50,
    totalAUM: "EUR 30Mil"
  },
  {
    name: "Private Equity Fund C",
    symbol: "FUND-C",
    availableUnits: 150,
    totalAUM: "GBP 25Mil"
  }
];

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-15">
      <h1 className="text-3xl font-bold mb-15">Available Fund Tokens</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tokens.map((token) => (
          <TokenCard key={token.symbol} {...token} />
        ))}
      </div>
    </div>
  );
}

export default App;
