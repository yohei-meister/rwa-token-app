import { useParams } from "react-router-dom";
import { fundsBySymbol } from "../data/funds";

export default function FundDetail() {
  const { symbol } = useParams();
  const fund = fundsBySymbol[symbol];

  if (!fund) {
    return <div className="p-6">Fund not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
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
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Invest Now
      </button>
    </div>
  );
}
