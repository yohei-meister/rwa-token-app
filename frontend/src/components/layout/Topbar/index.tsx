"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WalletConnectButton } from "@/components/layout/Topbar/buttons/WalletConnectButton";
import { useWalletStore } from "@/stores/walletStore";
import { UserTypes } from "@/data/users";

export function Topbar() {
  const { selectedUser, isConnected } = useWalletStore();

  // 色の決定ロジック
  const getBackgroundColor = () => {
    if (!isConnected || !selectedUser) {
      return "bg-white"; // 未接続時は変化なし（白）
    }

    if (selectedUser.userType === UserTypes.FUND) {
      return "bg-red-100"; // Fundは赤
    }

    // User系（USER_A, USER_B, USER_C）はブルー
    if (
      selectedUser.userType === UserTypes.USER_A ||
      selectedUser.userType === UserTypes.USER_B ||
      selectedUser.userType === UserTypes.USER_C
    ) {
      return "bg-blue-100"; // Userはブルー
    }

    return "bg-white"; // デフォルト
  };

  return (
    <>
      <div className={`relative flex justify-center items-center p-4 py-8 border-b transition-colors duration-300 ${getBackgroundColor()}`}>
        <div className="absolute left-4 flex items-center">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-xl font-bold">RWA Token Marketplace</h1>
          </Link>
        </div>

        <div className="absolute right-4 flex items-center gap-2">
          <WalletConnectButton />
        </div>
      </div>
      {/* ナビゲーションメニュー - 接続時のみ表示 */}
      {isConnected && selectedUser && (
        <div className="text-center p-4 border-b">
          <div className="flex justify-center gap-4">
            {selectedUser.userType === UserTypes.FUND ? (
              // Fund用のナビゲーション
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            ) : (
              // User用のナビゲーション
              <>
                <Link href="/register">
                  <Button variant="ghost">Register</Button>
                </Link>
                <Link href="/products">
                  <Button variant="ghost">Products</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
