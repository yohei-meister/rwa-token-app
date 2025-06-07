import { createContext, useContext, useState, useCallback } from "react";
import { funds } from "../data/funds";

const FundContext = createContext(null);

export function FundProvider({ children }) {
  const [fundsData, setFundsData] = useState(funds);

  const updateFundTokens = useCallback((fundId, purchasedAmount) => {
    setFundsData((prevFunds) =>
      prevFunds.map((fund) =>
        fund.id === fundId
          ? { ...fund, availableUnits: fund.availableUnits - purchasedAmount }
          : fund
      )
    );
  }, []);

  const getFundById = useCallback(
    (id) => {
      return fundsData.find((fund) => fund.id === parseInt(id));
    },
    [fundsData]
  );

  const value = {
    funds: fundsData,
    updateFundTokens,
    getFundById
  };

  return <FundContext.Provider value={value}>{children}</FundContext.Provider>;
}

export function useFund() {
  const context = useContext(FundContext);
  if (!context) {
    throw new Error("useFund must be used within a FundProvider");
  }
  return context;
}
