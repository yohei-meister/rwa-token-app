# RWA Tokenized PE Fund Marketplace Demo (XRPL)

## 🚀 What is this?

A proof-of-concept DApp for investing in tokenized private equity funds on the XRP Ledger.

## 🧩 Features

- Connect XRPL Wallet (XAMAN)
- Display available funds (Fund A, Fund B, Fund C)
- Purchase fund tokens using XRP
- Real-time balance updates
- Token issuance via `xrpl.js`
- Toast notifications and responsive UI

## 💻 Tech Stack

- React + Vite
- Tailwind CSS
- XRPL (xrpl.js)
- XUMM OAuth2 PKCE
- .env-based configuration (for XRPL testnet credentials)

## ⚙️ How to Run Locally

1. Clone the repository

```bash
git clone https://github.com/yohei-meister/rwa-token-app
cd rwa-token-app
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
# Copy the testnet credentials and XUMM API key from .env.local.public to .env
cp .env.local.public .env
```

> **Note**: This app uses:
>
> - XRPL testnet accounts for token operations (because XAMAN wallets cannot handle testnet tokens)
> - A demo XAMAN API key for wallet connection
>
> The credentials in `.env.local.public` are pre-configured for testing the application. For production use, you should:
>


4. Start the development server

```bash
npm run dev
```

> **Important**: This demo app only works with the development server at `http://localhost:5173/`. This is because the XUMM API key is registered only for this URL in the XAMAN developer portal. If you need to use a different URL, you'll need to:
>
> 1. Get your own XAMAN API key from the [XAMAN Developer Portal](https://apps.xaman.dev/)
> 2. Register your desired URL in the XAMAN developer portal
> 3. Update the API key in your `.env` file

## ⚙️ How to Run Locally with Docker

1. **Clone the repository**

```bash
git clone https://github.com/yohei-meister/rwa-token-app
cd rwa-token-app
```

2. **Start the development server with Docker Compose**

```bash
docker compose up --build
```

3. **Stop the server**

```bash
docker compose down
```

## 📝 Note

This project uses XRPL Testnet.
If the Testnet faucet is down, use preset accounts.
