// src/components/SendPage.jsx
import { useSearchParams } from "react-router-dom";

export default function SendPage() {
  const [searchParams] = useSearchParams();
  const fundSymbol = searchParams.get("symbol");

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow bg-white">
      <h2 className="text-2xl font-bold mb-4">Invest in {fundSymbol}</h2>

      <form className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">
            Your Wallet Address
          </label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter your XRPL wallet address"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Amount to Invest</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter amount"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}
