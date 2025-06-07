import { Link } from "react-router-dom";

export default function TokenCard({
  name,
  symbol,
  description,
  category,
  totalAUM
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{name}</h2>
        <p className="text-sm text-gray-500 mb-4">{symbol}</p>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {description}
          <span>...</span>
        </p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            Category:{" "}
            <span className="font-medium text-gray-900">{category}</span>
          </p>
          <p className="text-sm text-gray-500">
            Total AUM:{" "}
            <span className="font-medium text-gray-900">{totalAUM}</span>
          </p>
        </div>
        <Link
          to={`/funds/${symbol}`}
          className="mt-4 block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
