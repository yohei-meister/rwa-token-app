import { useState } from "react";
import "./App.css";
import React from "react";
import TokenCard from "./components/TokenCard";
import { funds } from "./data/funds";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-30">
      <h1 className="text-3xl font-bold mb-15">Available Fund Tokens</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10">
        {funds.map((token) => (
          <TokenCard key={token.symbol} {...token} />
        ))}
      </div>
    </div>
  );
}

export default App;
