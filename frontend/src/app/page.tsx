import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { funds, type Fund } from "@/data/funds";

// 文字数制限用のヘルパー関数
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

const FundCard: React.FC<{ fund: Fund }> = ({ fund }) => {
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

export default function Home() {
  return (
    <div className="font-sans flex-1 bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="grid grid-cols-2 gap-8">
          {funds.map((fund) => (
            <FundCard key={fund.symbol} fund={fund} />
          ))}
        </div>
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
