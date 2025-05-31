export const funds = [
  {
    name: "Private Equity Fund A",
    symbol: "FUND-A",
    availableUnits: 100,
    totalAUM: "USD 50M",
    category: "Buyout",
    description:
      "This fund focuses on acquiring majority stakes in mature companies."
  },
  {
    name: "Growth Equity Fund B",
    symbol: "FUND-B",
    availableUnits: 50,
    totalAUM: "EUR 30M",
    category: "Growth Equity",
    description:
      "This fund invests in high-growth companies seeking to expand their operations."
  },
  {
    name: "Venture Capital Fund C",
    symbol: "FUND-C",
    availableUnits: 150,
    totalAUM: "GBP 25M",
    category: "Venture Capital",
    description:
      "This fund focuses on early-stage technology companies with high potential."
  }
];

// オブジェクト形式でのアクセス用
export const fundsBySymbol = funds.reduce((acc, fund) => {
  acc[fund.symbol] = fund;
  return acc;
}, {});
