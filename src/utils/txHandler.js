import { sendToken } from "../lib/xrpl/sendToken";
import { sendXRP } from "../lib/xrpl/sendXRP";
import toast from "react-hot-toast";

/**
 * Handles the investment transaction process
 * @param {Object} params - Transaction parameters
 * @param {string} params.tokenSymbol - Symbol of the token to receive
 * @param {number} params.amount - Amount of tokens to receive
 * @param {number} params.tokenPrice - Price of each token in XRP
 * @param {string} params.fundSymbol - Symbol of the fund being invested in
 * @returns {Promise<Object>} Transaction result
 */
export async function handleInvestment({
  tokenSymbol,
  amount,
  tokenPrice,
  fundSymbol
}) {
  try {
    // First send tokens from issuer to destination
    console.log("Sending tokens:", {
      symbol: tokenSymbol,
      amount: amount,
      to: import.meta.env.VITE_XRPL_DESTINATION_ADDRESS
    });

    const tokenResult = await sendToken(tokenSymbol, amount);
    console.log("Token transaction result:", tokenResult);

    // Then send XRP from destination to issuer
    const totalXRP = amount * tokenPrice;
    console.log("Sending XRP:", {
      amount: totalXRP,
      from: import.meta.env.VITE_XRPL_DESTINATION_ADDRESS,
      to: import.meta.env.VITE_XRPL_ISSUER_ADDRESS
    });

    const xrpResult = await sendXRP(totalXRP);
    console.log("XRP transaction result:", xrpResult);

    // Show success message
    toast.success(
      `Successfully invested in ${fundSymbol}! ${amount} ${tokenSymbol} tokens received and ${totalXRP} XRP sent.`
    );

    return {
      success: true,
      tokenAmount: amount,
      xrpAmount: totalXRP
    };
  } catch (err) {
    console.error("Transaction error:", err);
    const errorMessage = err.details || err.message || "Transaction failed";
    toast.error(`Investment failed: ${errorMessage}`);
    throw err;
  }
}
