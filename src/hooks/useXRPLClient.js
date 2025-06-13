import { useState, useEffect } from "react";
import { Client } from "xrpl";

const TESTNET_URL = "wss://s.altnet.rippletest.net:51233";

export function useXRPLClient() {
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const xrplClient = new Client(TESTNET_URL);
    setClient(xrplClient);

    return () => {
      if (xrplClient && xrplClient.isConnected()) {
        xrplClient.disconnect();
      }
    };
  }, []);

  const connect = async () => {
    if (!client) return;
    try {
      await client.connect();
      setIsConnected(true);
      setError(null);
    } catch (err) {
      setError(err.message);
      setIsConnected(false);
    }
  };

  const disconnect = async () => {
    if (!client) return;
    try {
      await client.disconnect();
      setIsConnected(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    client,
    isConnected,
    error,
    connect,
    disconnect
  };
}
