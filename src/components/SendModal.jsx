import { useEffect, useState } from "react";
import { useFund } from "../contexts/FundContext";
import { useXRPLClient } from "../hooks/useXRPLClient";
import {
  sendTokenTransaction,
  sendXRPTransaction
} from "../utils/xrplTransactions";
import toast from "react-hot-toast";

export default function SendModal({ isOpen, onClose, symbol }) {
  const { funds, updateFundTokens } = useFund();
  const { client, connect, disconnect } = useXRPLClient();
  const fund = funds.find((f) => f.symbol === symbol);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total XRP cost
  const totalXRP = amount
    ? (Number(amount) * fund.tokenPrice).toFixed(2)
    : "0.00";

  // Handle ESC key to close modal
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

  // Disable background scroll when modal is open
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

  // Reset form when modal opens
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
      await connect();

      // Send tokens from issuer to destination
      await sendTokenTransaction(client, {
        symbol: fund.tokenSymbol,
        amount: Number(amount),
        issuerAddress: import.meta.env.VITE_XRPL_ISSUER_ADDRESS,
        issuerSecret: import.meta.env.VITE_XRPL_ISSUER_SECRET,
        destinationAddress: import.meta.env.VITE_XRPL_DESTINATION_ADDRESS
      });

      // Send XRP from destination to issuer
      await sendXRPTransaction(client, {
        amount: Number(totalXRP),
        destinationAddress: import.meta.env.VITE_XRPL_DESTINATION_ADDRESS,
        destinationSecret: import.meta.env.VITE_XRPL_DESTINATION_SECRET,
        issuerAddress: import.meta.env.VITE_XRPL_ISSUER_ADDRESS
      });

      // Update available tokens
      updateFundTokens(fund.symbol, Number(amount));
      toast.success(
        `Successfully invested in ${fund.symbol}! ${amount} ${fund.tokenSymbol} tokens received and ${totalXRP} XRP sent.`,
        { duration: 5000 }
      );
      onClose();
    } catch (err) {
      setError(err.message);
      toast.error(`Investment failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
      await disconnect();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
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
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-5 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting || !!error}
                  >
                    {isSubmitting ? "Processing..." : "Confirm Investment"}
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
