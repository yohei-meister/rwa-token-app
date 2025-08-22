"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const APP_NAME = "RWA Fund Token Marketplace";

export default function Topbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // サーバーサイドレンダリング中は最小限のコンテンツを表示
  if (!mounted) {
    return (
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">{APP_NAME}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-9 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center p-4 border-b">
      {/* Logo/Brand */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold">{APP_NAME}</h1>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline">Connect</Button>
      </div>
    </div>
  );
}
