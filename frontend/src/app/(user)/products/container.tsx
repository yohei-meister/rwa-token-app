// @ts-nocheck
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { funds, type Fund } from "@/data/funds";
import { useEffect, useState } from "react";
import { useCredentialCheck } from "@/hooks/useCredentialCheck";
import { useCredentialAccept } from "@/hooks/useCredentialAccept";
import { useWalletStore } from "@/stores/walletStore";
import { kyc } from "@/data/kyc";

// 文字数制限用のヘルパー関数
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

const FundCard: React.FC<{ fund: Fund; userStatuses: string[] }> = ({
  fund,
  userStatuses,
}) => {
  return (
    <Card className="w-120 hover:shadow-lg transition-all duration-200 hover:scale-105">
      <CardHeader className="pb-3">
        <div>
          <CardTitle className="text-lg font-bold text-gray-900">
            {fund.name}
          </CardTitle>
          <CardDescription className="text-sm text-blue-600 font-medium">
            {fund.symbol} ({fund.tokenSymbol})
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description with character limit */}
        <p className="text-sm text-gray-700 leading-relaxed">
          {truncateText(fund.description, 500)}
        </p>

        {/* Fund details in a cleaner layout */}
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Category</span>
            <span className="text-sm font-semibold text-gray-900 bg-blue-100 px-2 py-1 rounded-full">
              {fund.category}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Total AUM</span>
            <span className="text-sm font-semibold text-green-700">
              {fund.totalAUM}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Token Price</span>
            <span className="text-sm font-semibold text-purple-700">
              {fund.tokenPrice} XRP
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Available Units</span>
            <span className="text-sm font-semibold text-orange-700">
              {fund.availableUnits}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function ProductsContainer() {
  const { selectedUser, isConnected } = useWalletStore();
  const {
    data: credentialData,
    isLoading,
    error,
    refetch,
  } = useCredentialCheck(selectedUser?.address || "");
  const credentialAcceptMutation = useCredentialAccept();
  const [isAcceptingCredential, setIsAcceptingCredential] = useState(false);
  const [hasCheckedPendingCredentials, setHasCheckedPendingCredentials] =
    useState(false);

  // 文字列を16進数からデコードするヘルパー関数
  const hexToString = (hex: string): string => {
    try {
      return Buffer.from(hex, "hex").toString("utf8");
    } catch (error) {
      return hex;
    }
  };

  // ユーザーの所有するCredentialステータスを取得
  const getUserCredentialStatuses = () => {
    if (!credentialData?.result?.account_objects) return [];

    const credentials = credentialData.result.account_objects.filter(
      (obj: any) => obj.LedgerEntryType === "Credential",
    );

    const userStatuses: string[] = [];

    credentials.forEach((cred: any) => {
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

  // 未承認のCredentialCreate取引を確認してCredentialAcceptを実行
  const checkAndAcceptPendingCredentials = async () => {
    if (
      !credentialData?.result?.account_objects ||
      hasCheckedPendingCredentials
    )
      return;

    const allObjects = credentialData.result.account_objects;

    // CredentialCreateトランザクションを探す（未承認のCredential）
    const pendingCredentials = allObjects.filter((obj: any) => {
      // CredentialCreateから作られたが、まだAcceptされていないCredentialを探す
      return (
        obj.LedgerEntryType === "Credential" &&
        obj.Subject === selectedUser?.address &&
        !obj.Accepted
      ); // Acceptedフラグがfalseまたは存在しない
    });

    if (pendingCredentials.length === 0) {
      setHasCheckedPendingCredentials(true);
      return;
    }

    setIsAcceptingCredential(true);

    for (const pendingCred of pendingCredentials) {
      try {
        const credentialType = hexToString(pendingCred.CredentialType || "");

        // High StatusまたはLow Statusの場合のみAcceptを実行
        if (
          credentialType === "High Status" ||
          credentialType === "Low Status"
        ) {
          console.log(`Auto-accepting credential: ${credentialType}`);

          await credentialAcceptMutation.mutateAsync({
            input: {
              Issuer: pendingCred.Issuer,
              CredentialType: credentialType,
            },
          });

          console.log(`Successfully accepted credential: ${credentialType}`);
        }
      } catch (error) {
        console.error("Error accepting credential:", error);
      }
    }

    // すべての処理完了後、状態をリセットしてデータを再取得
    setIsAcceptingCredential(false);
    setHasCheckedPendingCredentials(true);

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
      checkAndAcceptPendingCredentials();
    }
  }, [credentialData, selectedUser, isConnected]);

  // ウォレットが変更されたときに状態をリセット
  useEffect(() => {
    setHasCheckedPendingCredentials(false);
    setIsAcceptingCredential(false);
  }, [selectedUser?.address]);

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
                <FundCard
                  key={fund.symbol}
                  fund={fund}
                  userStatuses={userStatuses}
                />
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
    </div>
  );
}
