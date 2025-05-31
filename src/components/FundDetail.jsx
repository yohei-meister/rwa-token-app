import { useParams } from "react-router-dom";

const dummyFunds = {
  "FUND-A": {
    name: "Private Equity Fund A",
    symbol: "FUND-A",
    availableUnits: 100,
    totalAUM: "USD 50M",
    category: "Buyout",
    description:
      "This fund focuses on acquiring majority stakes in mature companies."
  }
  // FUND-B, FUND-C も同様に追加可能
};

export default function FundDetail() {
  const { symbol } = useParams();
  const fund = dummyFunds[symbol];

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
