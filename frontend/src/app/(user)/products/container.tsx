// @ts-nocheck
"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { funds } from "@/data/funds";
import { useCredentialAccept } from "@/hooks/useCredentialAccept";
import { useCredentialCheck } from "@/hooks/useCredentialCheck";
import { useWalletStore } from "@/stores/walletStore";
import { hexToString } from "@/utils/string";
import FundCard from "./_components/fund-card";

interface AccountObject {
  LedgerEntryType: string;
  Subject?: string;
  CredentialType?: string;
  Issuer?: string;
  Accepted?: boolean;
}

export default function ProductsContainer() {
  const { selectedUser, isConnected } = useWalletStore();
  const {
    data: credentialData,
    isLoading,
    refetch,
  } = useCredentialCheck(selectedUser?.address || "");
  const credentialAcceptMutation = useCredentialAccept();
  const [isAcceptingCredential, setIsAcceptingCredential] = useState(false);
  const [hasCheckedPendingCredentials, setHasCheckedPendingCredentials] =
    useState(false);
  const [showCredentialDialog, setShowCredentialDialog] = useState(false);
  const [pendingCredentials, setPendingCredentials] = useState<AccountObject[]>(
    [],
  );

  // ユーザーの所有するCredentialステータスを取得
  const getUserCredentialStatuses = () => {
    if (!credentialData?.result?.account_objects) return [];

    const credentials = credentialData.result.account_objects.filter(
      (obj: AccountObject) => obj.LedgerEntryType === "Credential",
    );

    const userStatuses: string[] = [];

    credentials.forEach((cred: AccountObject) => {
      const credentialType = hexToString(cred.CredentialType || "");
      if (credentialType === "High Status" || credentialType === "Low Status") {
        userStatuses.push(credentialType);
      }
    });

    return userStatuses;
  };

  // 後方互換性のため、メインステータスを返す関数も残す
  const getUserCredentialStatus = () => {
    const statuses = getUserCredentialStatuses();
    if (statuses.includes("High Status")) return "high";
    if (statuses.includes("Low Status")) return "low";
    return null;
  };

  // 未承認のCredentialCreate取引を確認してダイアログを表示
  const checkPendingCredentials = useCallback(() => {
    if (
      !credentialData?.result?.account_objects ||
      hasCheckedPendingCredentials
    )
      return;

    const allObjects = credentialData.result.account_objects;

    // CredentialCreateトランザクションを探す（未承認のCredential）
    const pendingCreds = allObjects.filter((obj: AccountObject) => {
      // CredentialCreateから作られたが、まだAcceptされていないCredentialを探す
      return (
        obj.LedgerEntryType === "Credential" &&
        obj.Subject === selectedUser?.address &&
        !obj.Accepted
      ); // Acceptedフラグがfalseまたは存在しない
    });

    if (pendingCreds.length === 0) {
      setHasCheckedPendingCredentials(true);
      return;
    }

    // High StatusまたはLow StatusのCredentialのみをフィルタリング
    const validCredentials = pendingCreds.filter((cred) => {
      const credentialType = hexToString(cred.CredentialType || "");
      return (
        credentialType === "High Status" || credentialType === "Low Status"
      );
    });

    if (validCredentials.length > 0) {
      setPendingCredentials(validCredentials);
      setShowCredentialDialog(true);
    } else {
      setHasCheckedPendingCredentials(true);
    }
  }, [credentialData, selectedUser, hasCheckedPendingCredentials]);

  // CredentialAcceptを実行
  const handleAcceptCredentials = async () => {
    setIsAcceptingCredential(true);
    setShowCredentialDialog(false);

    for (const pendingCred of pendingCredentials) {
      try {
        const credentialType = hexToString(pendingCred.CredentialType || "");

        await credentialAcceptMutation.mutateAsync({
          input: {
            Issuer: pendingCred.Issuer,
            CredentialType: credentialType,
          },
        });

        console.log(`Successfully accepted credential: ${credentialType}`);
      } catch (error) {
        console.error("Error accepting credential:", error);
      }
    }

    // すべての処理完了後、状態をリセットしてデータを再取得
    setIsAcceptingCredential(false);
    setHasCheckedPendingCredentials(true);
    setPendingCredentials([]);

    // データを再取得
    setTimeout(() => {
      refetch();
    }, 1000);
  };

  const userStatuses = getUserCredentialStatuses();
  const userStatus = getUserCredentialStatus(); // 表示用の後方互換性

  // アクセス可能なファンドのみをフィルタリング
  const getAccessibleFunds = () => {
    return funds.filter((fund) => {
      return fund.requiredStatus.some((requiredStatus) =>
        userStatuses.includes(requiredStatus),
      );
    });
  };

  const accessibleFunds = getAccessibleFunds();

  // credentialDataが更新されたときに未承認のCredentialをチェック
  useEffect(() => {
    if (
      credentialData &&
      selectedUser &&
      isConnected &&
      !isAcceptingCredential
    ) {
      checkPendingCredentials();
    }
  }, [
    credentialData,
    selectedUser,
    isConnected,
    isAcceptingCredential,
    checkPendingCredentials,
  ]);

  // ウォレットが変更されたときに状態をリセット
  useEffect(() => {
    setHasCheckedPendingCredentials(false);
    setIsAcceptingCredential(false);
    setShowCredentialDialog(false);
    setPendingCredentials([]);
  }, []);

  // ローディング状態
  if (isLoading) {
    return (
      <div className="font-sans flex-1 bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="text-center">
            <Spinner className="mx-auto mb-4" />
            <div className="text-lg text-gray-700 font-semibold mb-2">
              Checking Your Credentials
            </div>
            <div className="text-sm text-gray-500">
              Please wait while we verify your access level...
            </div>
          </div>
        </main>
      </div>
    );
  }

  // CredentialAccept処理中の表示
  if (isAcceptingCredential) {
    return (
      <div className="font-sans flex-1 bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="text-center">
            <Spinner className="mx-auto mb-4" />
            <div className="text-lg text-green-700 font-semibold mb-2">
              Accepting New Credentials
            </div>
            <div className="text-sm text-gray-600">
              We found new credentials for your account.
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Accepting them automatically...
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ウォレット未接続
  if (!isConnected || !selectedUser) {
    return (
      <div className="font-sans flex-1 bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <Alert className="max-w-md">
            <AlertDescription>
              Please connect your wallet to view available products.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  // Credentialなし（アクセス拒否）
  if (!userStatus) {
    return (
      <div className="font-sans flex-1 bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <Alert variant="destructive" className="max-w-md">
            <AlertDescription>
              You don't have the required credentials to access these products.
              Please complete the registration process first.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="font-sans flex-1 bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* User Status Display */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Investment Products
            </h1>
            <p className="text-sm text-gray-600">
              Available investment opportunities
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Your Status:</span>
            <Badge
              variant={userStatus === "high" ? "default" : "secondary"}
              className={
                userStatus === "high"
                  ? "bg-blue-100 text-blue-800 border-blue-300"
                  : "bg-gray-100 text-gray-800 border-gray-300"
              }
            >
              {userStatus === "high" ? "High Status" : "Low Status"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {accessibleFunds.length === 0 ? (
          <Alert className="max-w-md">
            <AlertDescription>
              No investment products are currently available for your credential
              level. Please contact support to upgrade your access.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="flex justify-center">
            <div
              className={`${
                accessibleFunds.length === 2
                  ? "grid grid-cols-2 gap-12 max-w-5xl"
                  : "flex flex-col items-center gap-8 max-w-2xl w-full"
              }`}
            >
              {accessibleFunds.map((fund) => (
                <FundCard key={fund.symbol} fund={fund} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 h-12 flex items-center justify-center flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              © 2025 RWA Token App. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Credential Acceptance Dialog */}
      <Dialog
        open={showCredentialDialog}
        onOpenChange={setShowCredentialDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新しい認証情報が利用可能です</DialogTitle>
            <DialogDescription>
              あなたのアカウントに新しい認証情報が発行されました。
              以下の認証情報を承認してアクセス権限を取得しますか？
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {pendingCredentials.map((cred, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-sm">
                  {hexToString(cred.CredentialType || "")}
                </div>
                <div className="text-xs text-gray-500">
                  発行者: {cred.Issuer}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCredentialDialog(false)}
            >
              キャンセル
            </Button>
            <Button onClick={handleAcceptCredentials}>承認する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
