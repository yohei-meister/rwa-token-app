"use client";

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
  return (
    <div className="font-sans flex-1 bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <div className="flex flex-row gap-4 justify-center items-center py-10">
        {funds.map((fund) => (
          <Card key={fund.symbol} className="w-120 transition-all duration-200">
            <CardHeader>
              <CardTitle>{fund.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="設定を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">アクティブ</SelectItem>
                  <SelectItem value="inactive">非アクティブ</SelectItem>
                  <SelectItem value="maintenance">メンテナンス</SelectItem>
                </SelectContent>
              </Select>
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
