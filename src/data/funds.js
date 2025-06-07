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
    name: "Infrastructure Equity Fund C",
    symbol: "FUND-C",
    tokenSymbol: "FDC",
    availableUnits: 150,
    totalAUM: "GBP 25M",
    category: "Infrastructure",
    tokenPrice: 0.3, // XRP per token
    description:
      "This fund is primarily focused on investing in infrastructure assets that form the backbone of modern economies—such as transportation networks, energy systems, digital connectivity, and essential utilities. These assets typically exhibit long-term, stable cash flows, underpinned by high barriers to entry, regulatory frameworks, and long-term contracts or concessions with governments or municipalities. The fund targets both brownfield assets—existing operational infrastructure that may require optimization or recapitalization—and selected greenfield projects, where capital is needed to finance the construction and development of new infrastructure. Investments are often made through equity ownership or public-private partnerships (PPPs), enabling the fund to participate directly in the long-term value creation of critical infrastructure assets. A key characteristic of infrastructure equity is its inflation-linked revenue profile, which makes it particularly attractive in uncertain macroeconomic environments. The fund seeks to balance yield and growth, often distributing stable income to investors while also participating in capital appreciation over time. By deploying patient capital into strategic infrastructure projects, the fund aims to generate predictable, risk-adjusted returns while supporting broader societal goals such as decarbonization, digital access, and resilient public services. These investments not only drive long-term economic productivity but also contribute meaningfully to sustainable development initiatives on a global scale."
  }
];

// オブジェクト形式でのアクセス用
export const fundsBySymbol = funds.reduce((acc, fund) => {
  acc[fund.symbol] = fund;
  return acc;
}, {});
