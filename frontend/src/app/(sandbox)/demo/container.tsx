"use client";

import { useState, useId } from "react";
import { Loader2, CheckCircle, XCircle, Wallet } from "lucide-react";

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
import { useCredentialCheck } from "@/hooks/useCredentialCheck";
import { useCredentialDelete } from "@/hooks/useCredentialDelete";
import { useWalletStore } from "@/stores/walletStore";

export default function DemoContainer() {
  const {
    mutate: createCredential,
    isPending: isCreatePending,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
    data: createData,
    error: createError,
  } = useCredentialCreate();
  
  const {
    mutate: deleteCredential,
    isPending: isDeletePending,
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
    data: deleteData,
    error: deleteError,
  } = useCredentialDelete();
  const { selectedUser, isConnected } = useWalletStore();
  const [credentialType, setCredentialType] = useState("KYC");
  const [subjectAddress, setSubjectAddress] = useState("");
  const [issuerAddress, setIssuerAddress] = useState("");
  const credentialTypeId = useId();
  const subjectAddressId = useId();
  const issuerAddressId = useId();

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

  const handleDeleteCredential = () => {
    if (!isConnected || !selectedUser) {
      alert("Please connect a wallet first");
      return;
    }

    deleteCredential({
      input: {
        Issuer: issuerAddress || selectedUser.address,
        Subject: selectedUser.address, // 本人が削除主体
        CredentialType: credentialType,
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            XRPL Credential Create Demo
          </CardTitle>
          <CardDescription>
            Create and manage credentials on the XRPL network
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

          {/* Credential Form */}
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
              <Label htmlFor={subjectAddressId}>
                Subject Address (Optional)
              </Label>
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

            <div>
              <Label htmlFor={issuerAddressId}>Issuer Address (for Delete)</Label>
              <Input
                id={issuerAddressId}
                type="text"
                value={issuerAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setIssuerAddress(e.target.value)
                }
                placeholder="Enter issuer address for credential deletion"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Required for deleting credentials issued by others
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreateCredential}
                disabled={isCreatePending || !isConnected}
                className="flex-1"
              >
                {isCreatePending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Credential"
                )}
              </Button>
              
              <Button
                onClick={handleDeleteCredential}
                disabled={isDeletePending || !isConnected}
                variant="destructive"
                className="flex-1"
              >
                {isDeletePending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Credential"
                )}
              </Button>
            </div>
          </div>

          {/* Status Messages */}
          {isCreateError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Error creating credential: {createError?.message || "Unknown error"}
              </AlertDescription>
            </Alert>
          )}

          {isDeleteError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Error deleting credential: {deleteError?.message || "Unknown error"}
              </AlertDescription>
            </Alert>
          )}

          {isCreateSuccess && createData && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Credential created successfully! Transaction Hash:{" "}
                {createData.result?.hash}
              </AlertDescription>
            </Alert>
          )}

          {isDeleteSuccess && deleteData && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Credential deleted successfully! Transaction Hash:{" "}
                {deleteData.result?.hash}
              </AlertDescription>
            </Alert>
          )}

          {/* Transaction Details */}
          {(createData || deleteData) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transaction Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Type:</span>
                    <Badge variant="outline">
                      {createData ? "Create" : "Delete"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <Badge
                      variant={(createData?.result?.validated || deleteData?.result?.validated) ? "default" : "secondary"}
                    >
                      {(createData?.result?.validated || deleteData?.result?.validated) ? "Validated" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Hash:</span>
                    <span className="font-mono text-xs break-all">
                      {createData?.result?.hash || deleteData?.result?.hash}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Ledger Index:</span>
                    <span>{createData?.result?.ledger_index || deleteData?.result?.ledger_index}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Fee:</span>
                    <span>{createData?.result?.tx_json?.Fee || deleteData?.result?.tx_json?.Fee} XRP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
