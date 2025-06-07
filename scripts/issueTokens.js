import xrpl from "xrpl";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const ISSUER_ADDRESS = process.env.VITE_XRPL_ISSUER_ADDRESS;
const ISSUER_SECRET = process.env.VITE_XRPL_ISSUER_SECRET;
const DESTINATION_ADDRESS = process.env.VITE_XRPL_DESTINATION_ADDRESS;
const TESTNET_URL = "wss://s.altnet.rippletest.net:51233";

// Token configurations
const TOKENS = [
  { symbol: "FDA", amount: "100" },
  { symbol: "FDB", amount: "50" },
  { symbol: "FDC", amount: "150" }
];

async function issueTokens() {
  if (!ISSUER_ADDRESS || !ISSUER_SECRET || !DESTINATION_ADDRESS) {
    console.error("Missing environment variables");
    process.exit(1);
  }

  const client = new xrpl.Client(TESTNET_URL);
  await client.connect();
  console.log("Connected to XRPL Testnet");

  const wallet = xrpl.Wallet.fromSeed(ISSUER_SECRET);

  for (const token of TOKENS) {
    try {
      const tx = {
        TransactionType: "Payment",
        Account: ISSUER_ADDRESS,
        Destination: DESTINATION_ADDRESS,
        Amount: {
          currency: token.symbol,
          value: token.amount,
          issuer: ISSUER_ADDRESS
        }
      };

      const prepared = await client.autofill(tx);
      const signed = wallet.sign(prepared);
      const result = await client.submitAndWait(signed.tx_blob);
      console.log(
        `Sent ${token.amount} ${token.symbol} to ${DESTINATION_ADDRESS}`
      );
    } catch (err) {
      console.error(`Error sending ${token.symbol}:`, err.message);
    }
  }

  await client.disconnect();
  console.log("Disconnected from XRPL");
}

issueTokens();
