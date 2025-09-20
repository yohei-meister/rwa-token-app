"use client";

import { CheckCircle, XCircle, CreditCard, Shield, User } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCredentialCheck } from "@/hooks/useCredentialCheck";
import { useWalletStore } from "@/stores/walletStore";

export default function CheckoutContainer() {
  const { selectedUser, isConnected } = useWalletStore();

  // 接続中のウォレットのアドレスを使用
  const walletAddress = selectedUser?.address;

  const {
    data: credentialCheck,
    isLoading,
    isError,
  } = useCredentialCheck(walletAddress || "");

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            XRPL Credential Checkout
          </CardTitle>
          <CardDescription>
            Verify credentials and proceed with checkout on the XRPL network
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

          {/* Credential Verification Status */}
          {isConnected && selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">
                      Credential Verification
                    </p>
                    <p className="text-sm text-gray-600">
                      Checking credentials for wallet address
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  ) : isError ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>

              {/* Credential Details */}
              {credentialCheck && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Account Objects Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        <Badge
                          variant={
                            credentialCheck.result?.account_objects?.length
                              ? "default"
                              : "secondary"
                          }
                        >
                          {credentialCheck.result?.account_objects?.length
                            ? "Found Objects"
                            : "No Objects"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Objects Count:</span>
                        <span>
                          {credentialCheck.result?.account_objects?.length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Ledger Index:</span>
                        <span>{credentialCheck.result?.ledger_index}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Validated:</span>
                        <span>
                          {credentialCheck.result?.validated ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    {/* Account Objects Details */}
                    {credentialCheck.result?.account_objects &&
                      credentialCheck.result.account_objects.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Account Objects:</h4>
                          <div className="space-y-2">
                            {credentialCheck.result.account_objects.map(
                              (obj: unknown, index: number) => (
                                <div
                                  key={`object-${index}-${JSON.stringify(obj).slice(0, 20)}`}
                                  className="p-2 bg-gray-50 rounded text-xs"
                                >
                                  <div className="font-mono break-all">
                                    {JSON.stringify(obj, null, 2)}
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </CardContent>
                </Card>
              )}

              {/* Error State */}
              {isError && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to verify credentials. Please try again.
                  </AlertDescription>
                </Alert>
              )}

              {/* Success State */}
              {credentialCheck?.result?.account_objects?.length && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Account objects found! You can proceed with checkout.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Not Connected State */}
          {!isConnected && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Please connect a wallet to verify credentials and proceed with
                checkout.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
