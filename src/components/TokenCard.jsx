import { Link } from "react-router-dom";

export default function TokenCard({ name, symbol, availableUnits, totalAUM }) {
  return (
    <div className="border rounded-2xl shadow-sm p-10 bg-white hover:shadow-md transition">
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">{name}</h2>
      <p className="text-lg text-blue-500 mb-2">Symbol: {symbol}</p>
      <div className="flex flex-col text-lg text-gray-700 mb-3">
        <span>Available Units: {availableUnits}</span>
        <span>Total Fundraise Amount: ${totalAUM}</span>
      </div>

      <Link to={`/funds/${symbol}`}>
        <button className="w-2xs bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          View Details
        </button>
      </Link>
    </div>
  );
}
