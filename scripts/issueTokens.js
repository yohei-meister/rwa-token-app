const xrpl = require("xrpl");
require("dotenv").config();

// Configuration
const SENDER_ADDRESS = import.meta.env.VITE_XRPL_SENDER_ADDRESS;
const SENDER_SECRET = import.meta.env.VITE_XRPL_SENDER_SECRET;
const TESTNET_URL = "wss://s.altnet.rippletest.net:51233";

// Fund token configurations
const FUND_TOKENS = [
  { symbol: "FUND-A", amount: "100" },
  { symbol: "FUND-B", amount: "50" },
  { symbol: "FUND-C", amount: "150" }
];

async function issueTokens() {
  try {
    // Validate environment variables
    if (!SENDER_ADDRESS || !SENDER_SECRET) {
      throw new Error(
        "Missing required environment variables. Please check your .env file."
      );
    }

    // Connect to XRPL Testnet
    const client = new xrpl.Client(TESTNET_URL);
    await client.connect();
    console.log("Connected to XRPL Testnet");

    // Get sender account info
    const senderAccount = await client.request({
      command: "account_info",
      account: SENDER_ADDRESS,
      ledger_index: "validated"
    });

    console.log("Sender account found:", SENDER_ADDRESS);

    // Issue each token
    for (const token of FUND_TOKENS) {
      const issueTx = {
        TransactionType: "TrustSet",
        Account: SENDER_ADDRESS,
        LimitAmount: {
          currency: token.symbol,
          issuer: SENDER_ADDRESS,
          value: token.amount
        }
      };

      // Submit and wait for transaction
      const prepared = await client.autofill(issueTx);
      const signed = xrpl.Wallet.fromSeed(SENDER_SECRET).sign(prepared);
      const result = await client.submitAndWait(signed.tx_blob);

      console.log(`\nIssued ${token.amount} ${token.symbol}`);
      console.log("Transaction Hash:", result.result.hash);
      console.log("Transaction Status:", result.result.meta.TransactionResult);
    }

    await client.disconnect();
    console.log("\nAll tokens issued successfully!");
  } catch (error) {
    console.error("Error issuing tokens:", error);
    process.exit(1);
  }
}

// Run the script
issueTokens();
