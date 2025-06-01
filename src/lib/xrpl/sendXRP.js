import { Client, Wallet, xrpToDrops } from "xrpl";

const TESTNET_URL = "wss://s.altnet.rippletest.net:51233";

/**
 * Sends XRP from the sender wallet to the destination address
 * @param {number} amount - Amount of XRP to send (fixed to 10 XRP for now)
 * @returns {Promise<Object>} Transaction result
 */
export async function sendXRP(amount = 10) {
  const client = new Client(TESTNET_URL);
  let result = null;
  let error = null;

  try {
    await client.connect();

    // Get credentials from environment variables
    const senderSecret = import.meta.env.VITE_XRPL_SENDER_SECRET;
    const destinationAddress = import.meta.env.VITE_XRPL_DESTINATION;

    if (!senderSecret || !destinationAddress) {
      throw new Error("Missing required environment variables");
    }

    // Create a wallet using the sender's secret
    const wallet = Wallet.fromSecret(senderSecret);

    // Prepare the transaction
    const payment = {
      TransactionType: "Payment",
      Account: wallet.address,
      Amount: xrpToDrops(amount.toString()), // Convert XRP to drops
      Destination: destinationAddress
    };

    // Submit the transaction
    const paymentResult = await client.submitAndWait(payment, {
      wallet,
      autofill: true // Automatically fill in fields like Fee and Sequence
    });

    result = {
      success: true,
      hash: paymentResult.result.hash,
      status: paymentResult.result.meta.TransactionResult,
      amount: amount,
      from: wallet.address,
      to: destinationAddress
    };
  } catch (err) {
    console.error("Error sending XRP:", err);
    error = {
      success: false,
      message: err.message,
      details: err.data?.resultMessage || err.data?.resultCode || null
    };
  } finally {
    if (client.isConnected()) {
      await client.disconnect();
    }
  }

  if (error) {
    throw error;
  }

  return result;
}

/**
 * Validates if the transaction was successful
 * @param {Object} result - Transaction result from sendXRP
 * @returns {boolean} Whether the transaction was successful
 */
export function isTransactionSuccessful(result) {
  return (
    result &&
    result.success === true &&
    result.status === "tesSUCCESS" &&
    result.hash
  );
}
