import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fundsBySymbol } from "../data/funds";

export default function SendModal({ isOpen, onClose, symbol }) {
  const fund = fundsBySymbol[symbol];
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

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

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }
    // ここに送金処理を実装
    console.log(`Sending ${amount} units to ${fund.symbol}`);
    onClose();
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
                    Number of Units
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      className={`block w-full rounded-md shadow-sm focus:ring-blue-500 text-lg py-2 px-3 ${
                        error
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                      placeholder="Enter amount"
                      value={amount}
                      onChange={handleAmountChange}
                      min="1"
                      max={fund.availableUnits}
                      required
                    />
                  </div>
                  {error ? (
                    <p className="mt-2 text-lg text-red-600">{error}</p>
                  ) : (
                    <p className="mt-3 text-lg text-gray-500">
                      Available units: {fund.availableUnits}
                    </p>
                  )}
                </div>

                <div className="mt-8 sm:mt-6 sm:flex sm:flex-row-reverse gap-3">
                  <button
                    type="submit"
                    className={`inline-flex w-full justify-center rounded-md px-5 py-3 text-lg font-semibold text-white shadow-sm sm:w-auto ${
                      error
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500"
                    }`}
                    disabled={!!error}
                  >
                    Confirm Investment
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-5 py-3 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onClose}
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
