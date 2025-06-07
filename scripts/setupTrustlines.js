import xrpl from "xrpl";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Configuration
const DESTINATION_ADDRESS = process.env.VITE_XRPL_DESTINATION_ADDRESS;
const DESTINATION_SECRET = process.env.VITE_XRPL_DESTINATION_SECRET;
const ISSUER_ADDRESS = process.env.VITE_XRPL_ISSUER_ADDRESS;
const TESTNET_URL = "wss://s.altnet.rippletest.net:51233";

// Token configurations
const TOKENS = [
  { symbol: "FDA", amount: "10000000" },
  { symbol: "FDB", amount: "10000000" },
  { symbol: "FDC", amount: "10000000" }
];

async function setupTrustlines() {
  if (!DESTINATION_ADDRESS || !DESTINATION_SECRET || !ISSUER_ADDRESS) {
    console.error("Missing environment variables");
    process.exit(1);
  }

  const client = new xrpl.Client(TESTNET_URL);
  await client.connect();
  console.log("Connected to XRPL Testnet");

  const wallet = xrpl.Wallet.fromSeed(DESTINATION_SECRET);

  for (const token of TOKENS) {
    try {
      const tx = {
        TransactionType: "TrustSet",
        Account: DESTINATION_ADDRESS,
        LimitAmount: {
          currency: token.symbol,
          issuer: ISSUER_ADDRESS,
          value: token.amount
        }
      };

      const prepared = await client.autofill(tx);
      const signed = wallet.sign(prepared);
      const result = await client.submitAndWait(signed.tx_blob);

      console.log(`Trustline set up for ${token.symbol}`);
      console.log("Transaction Hash:", result.result.hash);
    } catch (err) {
      console.error(
        `Error setting up trustline for ${token.symbol}:`,
        err.message
      );
    }
  }

  await client.disconnect();
  console.log("Disconnected from XRPL");
}

// Run the script
setupTrustlines();
