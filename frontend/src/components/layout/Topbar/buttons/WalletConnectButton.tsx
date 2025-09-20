"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserTypes, users } from "@/data/users";
import { useWalletStore } from "@/stores/walletStore";

export function WalletConnectButton() {
  const { selectedUser, isConnected, selectUser, disconnect } =
    useWalletStore();
  const [userType, setUserType] = useState<UserTypes>(UserTypes.NO_SELECT);

  const handleUserSelect = (value: string) => {
    const selectedUserType = value as UserTypes;
    setUserType(selectedUserType);

    if (selectedUserType === UserTypes.NO_SELECT) {
      disconnect();
    } else {
      const user = users.find((u) => u.userType === selectedUserType);
      if (user) {
        selectUser(user);
      }
    }
  };

  useEffect(() => {
    if (selectedUser) {
      setUserType(selectedUser.userType);
    } else {
      setUserType(UserTypes.NO_SELECT);
    }
  }, [selectedUser]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          {isConnected && selectedUser ? (
            <>
              <span className="font-bold">{selectedUser.userType}</span>{" "}
              {selectedUser.address.slice(0, 6)}...
              {selectedUser.address.slice(-4)}
            </>
          ) : (
            "Connect"
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={userType}
          onValueChange={handleUserSelect}
        >
          <DropdownMenuRadioItem value={UserTypes.NO_SELECT}>
            No Select
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={UserTypes.FUND}>
            Fund(KYC)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={UserTypes.USER_A}>
            User(A)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={UserTypes.USER_B}>
            User(B)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={UserTypes.USER_C}>
            User(C)
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
