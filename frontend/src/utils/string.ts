// 文字列を16進数からデコードするヘルパー関数
export const hexToString = (hex: string): string => {
  try {
    return Buffer.from(hex, "hex").toString("utf8");
  } catch {
    return hex;
  }
};
