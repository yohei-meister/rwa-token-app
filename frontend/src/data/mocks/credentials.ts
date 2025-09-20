export type Credential = {
  id: string;
  name: string;
  description: string;
  type: string;
  issuer: string;
  status: "active" | "expired" | "pending";
  validUntil?: string;
};

export const credentials: Credential[] = [
  {
    id: "1",
    name: "KYC Verification Level 1",
    description: "Basic identity verification completed credential",
    type: "KYC",
    issuer: "XRPL Foundation",
    status: "active",
    validUntil: "2025-12-31",
  },
  {
    id: "2",
    name: "KYC Verification Level 2",
    description:
      "Advanced identity verification and income proof completed credential",
    type: "KYC",
    issuer: "XRPL Foundation",
    status: "active",
    validUntil: "2025-12-31",
  },
  {
    id: "3",
    name: "Investment Suitability Certificate",
    description: "Credential certifying investor qualification",
    type: "Investment",
    issuer: "Financial Authority",
    status: "active",
    validUntil: "2026-06-30",
  },
  {
    id: "4",
    name: "Institutional Investor Certification",
    description: "Credential for certified institutional investor",
    type: "Institutional",
    issuer: "Regulatory Body",
    status: "pending",
  },
  {
    id: "5",
    name: "AML Certification",
    description: "Anti-Money Laundering compliance certification",
    type: "Compliance",
    issuer: "Compliance Authority",
    status: "expired",
    validUntil: "2024-03-15",
  },
];
