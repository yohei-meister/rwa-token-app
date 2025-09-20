"use client";

import { useState, useId } from "react";
import { Loader2, CheckCircle, XCircle, Check } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCredentialAccept } from "@/hooks/useCredentialAccept";
import { useWalletStore } from "@/stores/walletStore";

export default function AcceptContainer() {
  const {
    mutate: acceptCredential,
    isPending,
    isSuccess,
    isError,
    data,
    error,
  } = useCredentialAccept();
  
  const { selectedUser, isConnected } = useWalletStore();
  const [credentialType, setCredentialType] = useState("KYC");
  const [issuerAddress, setIssuerAddress] = useState("");
  const credentialTypeId = useId();
  const issuerAddressId = useId();

  const handleAcceptCredential = () => {
    if (!isConnected || !selectedUser) {
      alert("Please connect a wallet first");
      return;
    }

    if (!issuerAddress) {
      alert("Please enter issuer address to accept credential");
      return;
    }

    acceptCredential({
      input: {
        Issuer: issuerAddress,
        CredentialType: credentialType,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Check className="h-5 w-5" />
          Accept Credential
        </CardTitle>
        <CardDescription>
          Accept a credential issued to you on the XRPL network
          <br />
          <span className="text-xs text-amber-600 font-medium">
            Note: The credential must first be created by the issuer with your address as the subject.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wallet Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium">Wallet Status</p>
            <p className="text-sm text-gray-600">
              {isConnected && selectedUser ? (
                <>
                  Connected as{" "}
                  <Badge variant="secondary">{selectedUser.userType}</Badge>
                  <br />
                  <span className="font-mono text-xs">
                    {selectedUser.address}
                  </span>
                </>
              ) : (
                "Not connected"
              )}
            </p>
          </div>
          <div className="flex items-center">
            {isConnected ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor={credentialTypeId}>Credential Type</Label>
            <Input
              id={credentialTypeId}
              type="text"
              value={credentialType}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCredentialType(e.target.value)
              }
              placeholder="e.g., KYC, AML, Identity"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor={issuerAddressId}>Issuer Address</Label>
            <Input
              id={issuerAddressId}
              type="text"
              value={issuerAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setIssuerAddress(e.target.value)
              }
              placeholder="Enter the address of the credential issuer"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              The address of the issuer who created the credential for you
            </p>
          </div>

          <Button
            onClick={handleAcceptCredential}
            disabled={isPending || !isConnected}
            className="w-full"
            variant="secondary"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Accepting Credential...
              </>
            ) : (
              "Accept Credential"
            )}
          </Button>
        </div>

        {/* Status Messages */}
        {isError && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Error accepting credential: {error?.message || "Unknown error"}
            </AlertDescription>
          </Alert>
        )}

        {isSuccess && data && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Credential accepted successfully! Transaction Hash:{" "}
              {data.result?.hash}
            </AlertDescription>
          </Alert>
        )}

        {/* Transaction Details */}
        {data && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transaction Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge
                    variant={data.result?.validated ? "default" : "secondary"}
                  >
                    {data.result?.validated ? "Validated" : "Pending"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Hash:</span>
                  <span className="font-mono text-xs break-all">
                    {data.result?.hash}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Ledger Index:</span>
                  <span>{data.result?.ledger_index}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Fee:</span>
                  <span>{data.result?.tx_json?.Fee} XRP</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
