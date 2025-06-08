export const funds = [
  {
    name: "Private Equity Fund A",
    symbol: "FUND-A",
    tokenSymbol: "FDA",
    availableUnits: 100,
    totalAUM: "USD 50M",
    category: "Buyout",
    tokenPrice: 0.5, // XRP per token
    description:
      "This fund is primarily dedicated to pursuing investment opportunities that involve the acquisition of majority ownership positions in established, mature companies. Rather than targeting early-stage startups or high-risk ventures, the fund strategically focuses on businesses that have already demonstrated a consistent track record of performance, profitability, and operational stability over time.By acquiring a controlling interest, the fund gains the ability to actively influence strategic decision-making, management direction, and long-term growth planning within these portfolio companies. This hands-on involvement allows the fund to implement value creation initiatives, such as operational improvements, organizational restructuring, or expansion into new markets, with the goal of enhancing the company’s overall enterprise value. Mature companies often operate in industries with predictable cash flows and established customer bases, providing a solid foundation for long-term investment. This approach also reduces the volatility and uncertainty typically associated with earlier-stage investments. Ultimately, the fund's investment thesis centers on identifying companies that are not only operationally sound, but also have untapped potential for transformation or efficiency gains under new ownership. Through disciplined acquisition strategies and active ownership, the fund aims to generate attractive risk-adjusted returns for its investors while fostering sustainable business growth in its portfolio."
  },
  {
    name: "Growth Equity Fund B",
    symbol: "FUND-B",
    tokenSymbol: "FDB",
    availableUnits: 50,
    totalAUM: "EUR 30M",
    category: "Growth Equity",
    tokenPrice: 0.2, // XRP per token
    description:
      "This fund is designed to target and support high-growth companies—businesses that are experiencing rapid revenue increases, expanding market share, and demonstrating strong momentum in their respective sectors. These companies are typically at a stage where they have already validated their core products or services and are now looking to scale their operations, both domestically and internationally. The primary objective of the fund is to provide strategic capital to help these growth-stage firms achieve their next level of expansion. This might include investments in sales and marketing, product development, technology infrastructure, or new market entry. In many cases, these companies may also be preparing for a future IPO or strategic acquisition, and the fund’s involvement is structured to help optimize their operational readiness and valuation. Unlike early-stage venture capital investments, which involve higher uncertainty, this fund focuses on companies that have already achieved product-market fit and are generating meaningful revenue. However, they still require significant capital and expertise to fully realize their growth potential. The fund often takes a minority equity position but plays an active, value-added role in helping management teams refine strategy, enhance execution, and accelerate growth. By aligning its interests with visionary entrepreneurs and scaling businesses, the fund aims to generate superior returns while supporting innovation, job creation, and economic expansion across a diverse range of industries."
  },
  {
    name: "Venture Capital Fund C",
    symbol: "FUND-C",
    tokenSymbol: "FDC",
    availableUnits: 150,
    totalAUM: "GBP 25M",
    category: "Venture Capital",
    tokenPrice: 0.3, // XRP per token
    description:
      "This fund is dedicated to identifying and supporting early-stage companies with high growth potential, typically in disruptive sectors such as technology, healthcare innovation, artificial intelligence, and sustainability. The fund focuses on startups that are developing novel products, business models, or platforms with the potential to transform industries or create entirely new markets. These companies are often pre-revenue or in the early stages of commercialization, and the fund plays an active role in helping them scale—providing not only capital, but also strategic guidance, access to networks, and operational expertise. The fund's investment approach is rooted in a long-term, high-conviction thesis, prioritizing visionary founders, defensible intellectual property, and large addressable markets. Portfolio companies may go through multiple funding rounds (Series A, B, and beyond), with the fund often participating in follow-on investments to support continued growth. The return profile is inherently asymmetric: while some investments may result in partial or complete capital loss, others have the potential to generate outsized returns—10x, 20x, or more—through successful exits such as IPOs, M&A transactions, or strategic buyouts. Risk management is integral to the fund's strategy, relying on portfolio diversification, staged capital deployment, and close collaboration with founders. The fund seeks to capture the innovation premium that comes from investing at the frontier of technological and societal change, while also aligning with thematic megatrends shaping the global economy. Through early backing of groundbreaking startups, the fund aims to deliver exceptional risk-adjusted returns and play a catalytic role in the growth of the next generation of market leaders."
  }
];

// オブジェクト形式でのアクセス用
export const fundsBySymbol = funds.reduce((acc, fund) => {
  acc[fund.symbol] = fund;
  return acc;
}, {});
