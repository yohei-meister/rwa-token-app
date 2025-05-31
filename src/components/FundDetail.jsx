import { useParams } from "react-router-dom";
import { fundsBySymbol } from "../data/funds";
import { useState } from "react";
import SendModal from "./SendModal";
import { Link } from "react-router-dom";

export default function FundDetail() {
  const { symbol } = useParams();
  const fund = fundsBySymbol[symbol];
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!fund) {
    return <div className="p-6">Fund not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-2">{fund.name}</h1>
      <p className="text-gray-600 mb-4">Symbol: {fund.symbol}</p>
      <div className="mb-4">
        <p>
          <strong>Category:</strong> {fund.category}
        </p>
        <p>
          <strong>Available Units:</strong> {fund.availableUnits}
        </p>
        <p>
          <strong>Total AUM:</strong> {fund.totalAUM}
        </p>
      </div>
      <p className="text-gray-700 mb-6">{fund.description}</p>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Invest Now
      </button>

      <SendModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        symbol={symbol}
      />
    </div>
  );
}
