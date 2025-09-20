"use client";

import { useState, useId } from "react";
import { Loader2, CheckCircle, XCircle, Plus } from "lucide-react";

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
import { useCredentialCreate } from "@/hooks/useCredentialCreate";
import { useWalletStore } from "@/stores/walletStore";

export default function CreateContainer() {
  const {
    mutate: createCredential,
    isPending,
    isSuccess,
    isError,
    data,
    error,
  } = useCredentialCreate();

  const { selectedUser, isConnected } = useWalletStore();
  const [credentialType, setCredentialType] = useState("KYC");
  const [subjectAddress, setSubjectAddress] = useState("");
  const credentialTypeId = useId();
  const subjectAddressId = useId();

  const handleCreateCredential = () => {
    if (!isConnected || !selectedUser) {
      alert("Please connect a wallet first");
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    createCredential({
      input: {
        TransactionType: "CredentialCreate",
        Account: selectedUser.address,
        Subject: subjectAddress || selectedUser.address,
        CredentialType: credentialType,
        Expiration: now + 3600, // 1時間後に期限切れ
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create Credential
        </CardTitle>
        <CardDescription>
          Issue a new credential on the XRPL network
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
            <Label htmlFor={subjectAddressId}>Subject Address (Optional)</Label>
            <Input
              id={subjectAddressId}
              type="text"
              value={subjectAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSubjectAddress(e.target.value)
              }
              placeholder="Leave empty to use current wallet address"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              If empty, will use the current wallet address as subject
            </p>
          </div>

          <Button
            onClick={handleCreateCredential}
            disabled={isPending || !isConnected}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Credential...
              </>
            ) : (
              "Create Credential"
            )}
          </Button>
        </div>

        {/* Status Messages */}
        {isError && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Error creating credential: {error?.message || "Unknown error"}
            </AlertDescription>
          </Alert>
        )}

        {isSuccess && data && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Credential created successfully! Transaction Hash:{" "}
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
