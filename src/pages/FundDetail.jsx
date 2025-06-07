import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SendModal from "../components/SendModal";
import { toast } from "react-hot-toast";
import { useFund } from "../contexts/FundContext";
import { fundsBySymbol } from "../data/funds";

export default function FundDetail() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { getFundById } = useFund();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fund, setFund] = useState(null);

  useEffect(() => {
    const foundFund = fundsBySymbol[symbol];
    if (!foundFund) {
      toast.error("Fund not found");
      navigate("/");
      return;
    }
    setFund(foundFund);
    setIsLoading(false);
  }, [symbol, navigate]);

  const handleTokenUpdate = (purchasedAmount) => {
    console.log("Updating tokens:", purchasedAmount);
    setFund((prevFund) => ({
      ...prevFund,
      availableUnits: prevFund.availableUnits - purchasedAmount
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!fund) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {fund.name}
                </h1>
                <p className="mt-1 text-sm text-gray-500">{fund.symbol}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Invest Now
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">
                  Token Price
                </h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {fund.tokenPrice} XRP
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">
                  Available Tokens
                </h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {fund.availableUnits}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Description</h3>
              <p className="mt-2 text-gray-500">{fund.description}</p>
            </div>
          </div>
        </div>
      </div>

      <SendModal
        key={fund.id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        symbol={fund.symbol}
        fundId={fund.id}
      />
    </div>
  );
}
