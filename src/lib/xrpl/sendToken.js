import { Client, Wallet } from "xrpl";

const TESTNET_URL = "wss://s.altnet.rippletest.net:51233";

/**
 * Sends tokens from the issuer to the destination address
 * @param {string} symbol - Token symbol (e.g., "FDA")
 * @param {string} amount - Amount of tokens to send
 * @returns {Promise<Object>} Transaction result
 */
export async function sendToken(symbol, amount) {
  const client = new Client(TESTNET_URL);
  let result = null;
  let error = null;

  try {
    await client.connect();
    console.log("Connected to XRPL Testnet");

    // Get credentials from environment variables
    const issuerSecret = import.meta.env.VITE_XRPL_ISSUER_SECRET;
    const issuerAddress = import.meta.env.VITE_XRPL_ISSUER_ADDRESS;
    const destinationAddress = import.meta.env.VITE_XRPL_DESTINATION_ADDRESS;

    console.log("Environment variables:", {
      issuerAddress: issuerAddress ? "Set" : "Not set",
      destinationAddress: destinationAddress ? "Set" : "Not set",
      issuerSecret: issuerSecret ? "Set" : "Not set"
    });

    if (!issuerSecret || !issuerAddress || !destinationAddress) {
      throw new Error("Missing required environment variables");
    }

    // Create a wallet using the issuer's secret
    const wallet = Wallet.fromSecret(issuerSecret);
    console.log("Wallet created for issuer:", issuerAddress);

    // Prepare the transaction
    const payment = {
      TransactionType: "Payment",
      Account: issuerAddress,
      Destination: destinationAddress,
      Amount: {
        currency: symbol,
        value: amount,
        issuer: issuerAddress
      }
    };

    console.log("Preparing transaction:", {
      symbol,
      amount,
      from: issuerAddress,
      to: destinationAddress
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
      symbol: symbol,
      from: issuerAddress,
      to: destinationAddress
    };
  } catch (err) {
    console.error("Error sending token:", err);
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
 * @param {Object} result - Transaction result from sendToken
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
