type XrplConfig = {
  wss: {
    dev: string;
  };
};

export const xrplConfig: XrplConfig = {
  wss: {
    dev: "wss://s.devnet.rippletest.net:51233/",
  },
};
