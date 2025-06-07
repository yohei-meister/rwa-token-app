import { useEffect, useState } from "react";
import { handleInvestment } from "../utils/txHandler";
import { useFund } from "../contexts/FundContext";

export default function SendModal({ isOpen, onClose, symbol, fundId }) {
  const { funds, updateFundTokens } = useFund();
  const fund = funds.find((f) => f.symbol === symbol);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total XRP cost
  const totalXRP = amount
    ? (Number(amount) * fund.tokenPrice).toFixed(2)
    : "0.00";

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // モーダルが開いているときは背景のスクロールを無効にする
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // モーダルが開かれるたびにフォームをリセット
  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setError("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const validateAmount = (value) => {
    if (!value || value.trim() === "") {
      return "Please enter an amount";
    }
    const numValue = Number(value);
    if (isNaN(numValue) || numValue <= 0) {
      return "Please enter a valid number greater than 0";
    }
    if (!Number.isInteger(numValue)) {
      return "Please enter a whole number of tokens";
    }
    if (numValue > fund.availableUnits) {
      return `Cannot exceed available units (${fund.availableUnits})`;
    }
    return "";
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    setError(validateAmount(value));
  };

  if (!isOpen || !fund) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await handleInvestment({
        tokenSymbol: fund.tokenSymbol,
        amount: Number(amount),
        tokenPrice: fund.tokenPrice,
        fundSymbol: fund.symbol
      });

      // Update available tokens
      updateFundTokens(fund.symbol, result.tokenAmount);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-6 pb-6 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-400 hover:text-gray-500"
            disabled={isSubmitting}
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Content */}
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-2xl font-semibold leading-6 text-gray-900 mb-6">
                Invest in {fund.name}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-lg font-medium text-gray-700 mb-2"
                  >
                    # of Tokens
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={handleAmountChange}
                    min="1"
                    step="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-lg"
                    placeholder="Enter amount"
                    disabled={isSubmitting}
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                  <div className="mt-3 space-y-2">
                    <p className="text-lg text-gray-500">
                      Available # of Tokens: {fund.availableUnits}
                    </p>
                    <p className="text-lg text-gray-500">
                      Token Price: {fund.tokenPrice} XRP per token
                    </p>
                    <p className="text-lg font-semibold text-blue-600">
                      Total Cost: {totalXRP} XRP
                    </p>
                  </div>
                </div>

                <div className="mt-8 sm:mt-6 sm:flex sm:flex-row-reverse gap-3">
                  <button
                    type="submit"
                    className={`inline-flex w-full justify-center rounded-md px-5 py-3 text-lg font-semibold text-white shadow-sm sm:w-auto ${
                      isSubmitting
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500"
                    }`}
                    disabled={isSubmitting || error}
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Confirm Investment"
                    )}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-5 py-3 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
