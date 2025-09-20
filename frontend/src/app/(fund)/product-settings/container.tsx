"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { funds } from "@/data/funds";

export default function ProductsContainer() {
  const [selectedFund, setSelectedFund] = useState<string>(funds[0].symbol);

  const filteredFunds = funds.filter(fund => fund.symbol === selectedFund);
  return (
    <div className="font-sans flex-1 bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <div className="flex justify-center py-4">
        <Select value={selectedFund} onValueChange={setSelectedFund}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="ファンドを選択" />
          </SelectTrigger>
          <SelectContent>
            {funds.map((fund) => (
              <SelectItem key={fund.symbol} value={fund.symbol}>
                {fund.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-row gap-4 justify-center items-center py-10">
        {filteredFunds.map((fund) => (
          <Card key={fund.symbol} className="w-120 transition-all duration-200">
            <CardHeader>
              <CardTitle>{fund.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">シンボル: {fund.symbol}</p>
                <p className="text-sm text-gray-600">ステータス: {fund.status}</p>
                <p className="text-sm text-gray-600">カテゴリ: {fund.category}</p>
                <p className="text-sm text-gray-600">総資産: {fund.totalAUM}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Edit</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
