"use client";

import Link from "next/link";
import { WalletConnectButton } from "@/components/layout/Topbar/buttons/WalletConnectButton";

export function Topbar() {
  return (
    <div className="relative flex justify-center items-center p-4 border-b">
      <div className="absolute left-4 flex items-center">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-xl font-bold">RWA Token Marketplace</h1>
        </Link>
      </div>

      <div className="absolute right-4 flex items-center gap-2">
        <WalletConnectButton />
      </div>
    </div>
  );
}
