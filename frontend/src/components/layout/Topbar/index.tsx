"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { WalletConnectButton } from "@/components/layout/Topbar/buttons/WalletConnectButton";
import { WalletMenuButton } from "@/components/layout/Topbar/buttons/WalletMenuButton";

export function Topbar() {
  return (
    <div className="relative flex justify-center items-center p-4 border-b">
      <div className="absolute left-4 flex items-center">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-xl font-bold">XRPL UNICORN</h1>
        </Link>
      </div>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/teams">TEAMS</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="absolute right-4 flex items-center gap-2">
        <WalletConnectButton />
        <WalletMenuButton />
      </div>
    </div>
  );
}
