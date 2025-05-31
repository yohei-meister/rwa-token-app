export default function TokenCard({ name, symbol, balance, nav }) {
  return (
    <div className="border rounded-2xl shadow-sm p-10 bg-white hover:shadow-md transition">
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">{name}</h2>
      <p className="text-lg text-blue-500 mb-2">Symbol: {symbol}</p>
      <div className="flex flex-col text-lg text-gray-700 mb-3">
        <span>Balance: {balance}</span>
        <span>NAV: ${nav}</span>
      </div>
      <button className="bg-blue-600 text-black rounded px-4 py-2 hover:bg-blue-700">
        View Details
      </button>
    </div>
  );
}
