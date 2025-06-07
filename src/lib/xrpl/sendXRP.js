import { Client, Wallet, xrpToDrops } from "xrpl";

const TESTNET_URL = "wss://s.altnet.rippletest.net:51233";

/**
 * Sends XRP from the destination wallet to the issuer address
 * @param {number} amount - Amount of XRP to send
 * @returns {Promise<Object>} Transaction result
 */
export async function sendXRP(amount) {
  const client = new Client(TESTNET_URL);
  let result = null;
  let error = null;

  try {
    await client.connect();
    console.log("Connected to XRPL Testnet");

    // Get credentials from environment variables
    const destinationSecret = import.meta.env.VITE_XRPL_DESTINATION_SECRET;
    const destinationAddress = import.meta.env.VITE_XRPL_DESTINATION_ADDRESS;
    const issuerAddress = import.meta.env.VITE_XRPL_ISSUER_ADDRESS;

    console.log("Environment variables:", {
      destinationAddress: destinationAddress ? "Set" : "Not set",
      issuerAddress: issuerAddress ? "Set" : "Not set",
      destinationSecret: destinationSecret ? "Set" : "Not set"
    });

    if (!destinationSecret || !destinationAddress || !issuerAddress) {
      throw new Error("Missing required environment variables");
    }

    // Create a wallet using the destination's secret
    const wallet = Wallet.fromSecret(destinationSecret);
    console.log("Wallet created for destination:", destinationAddress);

    // Prepare the transaction
    const payment = {
      TransactionType: "Payment",
      Account: destinationAddress,
      Amount: xrpToDrops(amount.toString()), // Convert XRP to drops
      Destination: issuerAddress
    };

    console.log("Preparing XRP transaction:", {
      amount,
      from: destinationAddress,
      to: issuerAddress
    });

    // Submit the transaction
    const prepared = await client.autofill(payment);
    console.log("Transaction prepared:", prepared);

    const signed = wallet.sign(prepared);
    console.log("Transaction signed");

    const paymentResult = await client.submitAndWait(signed.tx_blob);
    console.log("Transaction submitted:", paymentResult);

    result = {
      success: true,
      hash: paymentResult.result.hash,
      status: paymentResult.result.meta.TransactionResult,
      amount: amount,
      from: destinationAddress,
      to: issuerAddress
    };
  } catch (err) {
    console.error("Error sending XRP:", err);
    console.error("Error details:", {
      message: err.message,
      data: err.data,
      resultMessage: err.data?.resultMessage,
      resultCode: err.data?.resultCode
    });

    error = {
      success: false,
      message: err.message,
      details: err.data?.resultMessage || err.data?.resultCode || null
    };
  } finally {
    if (client.isConnected()) {
      await client.disconnect();
      console.log("Disconnected from XRPL");
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
