"use client";

import { useState, useId } from "react";
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
import { kyc } from "@/data/kyc";

interface KycSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function KycSelect({
  value,
  onValueChange,
  placeholder = "Select KYC Status",
  className = "",
}: KycSelectProps) {
  const selectId = useId();

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
        Select KYC Status
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={selectId} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {kyc.map((kycItem) => (
            <SelectItem key={kycItem.id} value={kycItem.id}>
              <span className="font-medium">{kycItem.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default function ProductsContainer() {
  const [selectedFund, setSelectedFund] = useState<string>(funds[0].symbol);
  const [selectedKyc, setSelectedKyc] = useState<string>("");
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);

  const filteredFunds = funds.filter((fund) => fund.symbol === selectedFund);

  const handleSave = () => {
    console.log("✅ Save successful!");
    console.log("Selected Fund:", selectedFund);
    console.log("Selected KYC:", selectedKyc);
    setShowSuccessAlert(true);

    // 3秒後にアラートを自動で非表示
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);
  };

  return (
    <div className="font-sans flex-1 bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <div className="flex justify-center pt-6">
        <Select value={selectedFund} onValueChange={setSelectedFund}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Fund" />
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

      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="flex justify-center pt-4">
          <Card className="w-96 bg-green-50 border-green-200 shadow-lg">
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-lg">✓</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-green-800">
                    Settings saved successfully!
                  </h3>
                  <p className="text-xs text-green-600 mt-1">
                    Your fund and KYC settings have been updated.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSuccessAlert(false)}
                  className="flex-shrink-0 text-green-400 hover:text-green-600 transition-colors"
                >
                  <span className="sr-only">Close success alert</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-row gap-4 justify-center items-start py-6">
        {filteredFunds.map((fund) => (
          <Card key={fund.symbol} className="w-120 transition-all duration-200">
            <CardHeader>
              <CardTitle>{fund.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Symbol: {fund.symbol}</p>
                  <p className="text-sm text-gray-600">Status: {fund.status}</p>
                  <p className="text-sm text-gray-600">
                    Category: {fund.category}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total AUM: {fund.totalAUM}
                  </p>
                </div>

                <KycSelect value={selectedKyc} onValueChange={setSelectedKyc} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
