import { Wallet, xrpToDrops } from "xrpl";

export async function sendTokenTransaction(
  client,
  { symbol, amount, issuerAddress, issuerSecret, destinationAddress },
) {
  if (!client || !client.isConnected()) {
    throw new Error("XRPL client not connected");
  }

  if (!issuerSecret || !issuerAddress || !destinationAddress) {
    throw new Error("Missing required transaction parameters");
  }

  const wallet = Wallet.fromSecret(issuerSecret);

  const payment = {
    TransactionType: "Payment",
    Account: issuerAddress,
    Destination: destinationAddress,
    Amount: {
      currency: symbol,
      value: String(amount),
      issuer: issuerAddress,
    },
  };

  const prepared = await client.autofill(payment);
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  if (result.result.meta.TransactionResult !== "tesSUCCESS") {
    throw new Error(
      `Transaction failed: ${result.result.meta.TransactionResult}`,
    );
  }

  return result;
}

export async function sendXRPTransaction(
  client,
  { amount, destinationAddress, destinationSecret, issuerAddress },
) {
  if (!client || !client.isConnected()) {
    throw new Error("XRPL client not connected");
  }

  if (!destinationSecret || !destinationAddress || !issuerAddress) {
    throw new Error("Missing required transaction parameters");
  }

  const wallet = Wallet.fromSecret(destinationSecret);

  const payment = {
    TransactionType: "Payment",
    Account: destinationAddress,
    Amount: xrpToDrops(amount.toString()),
    Destination: issuerAddress,
  };

  const prepared = await client.autofill(payment);
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  if (result.result.meta.TransactionResult !== "tesSUCCESS") {
    throw new Error(
      `Transaction failed: ${result.result.meta.TransactionResult}`,
    );
  }

  return result;
}

export async function getAccountBalances(client, address) {
  if (!client || !client.isConnected()) {
    throw new Error("XRPL client not connected");
  }

  const [accountInfo, accountLines] = await Promise.all([
    client.request({
      command: "account_info",
      account: address,
      ledger_index: "validated",
    }),
    client.request({
      command: "account_lines",
      account: address,
    }),
  ]);

  return {
    xrpBalance: Number(accountInfo.result.account_data.Balance) / 1_000_000,
    tokenBalances: accountLines.result.lines,
  };
}
