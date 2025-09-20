# RWA Tokenized PE Fund Marketplace Demo (XRPL)

## 🚀 Overview

A proof-of-concept DApp for investing in tokenized private equity funds on the XRP Ledger.

## 🧩 Features

- Connect XRPL Wallet (XAMAN)
- Display available funds (Fund A, Fund B, Fund C)
- Purchase fund tokens using XRP
- Real-time balance updates
- Token issuance via `xrpl.js`
- Toast notifications and responsive UI
- Credential management system
- KYC functionality
- Fund management dashboard

## 💻 Tech Stack

### Frontend (Main Application)
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- TanStack Query (React Query)
- Zustand (state management)
- XRPL (xrpl.js)
- Biome (linter & formatter)

### Legacy (Reference)
- React + Vite
- XUMM OAuth2 PKCE

## ⚙️ How to Run Locally

1. Clone the repository

```bash
git clone https://github.com/yohei-meister/rwa-token-app
cd rwa-token-app
```

2. Navigate to frontend directory and install dependencies

```bash
cd frontend
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

4. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

> **Important**: This demo app works with the development server at `http://localhost:3000/`. This is because the XUMM API key is registered for this URL in the XAMAN developer portal. If you need to use a different URL, you'll need to:
>
> 1. Get your own XAMAN API key from the [XAMAN Developer Portal](https://apps.xaman.dev/)
> 2. Register your desired URL in the XAMAN developer portal
> 3. Update the API key in your `.env` file

## 🐳 How to Run Locally with Docker

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

## 📂 Project Structure

```
frontend/                    # Main application
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (fund)/        # Fund management pages
│   │   ├── (sandbox)/     # Demo & testing features
│   │   └── (user)/        # User-related pages
│   ├── components/        # UI components
│   │   ├── layout/        # Layout components
│   │   └── ui/           # shadcn/ui components
│   ├── hooks/            # Custom React hooks
│   ├── stores/           # Zustand state management
│   ├── data/             # Mock data
│   └── config/           # Configuration files
├── package.json
└── ...

src/                        # Legacy Vite app (reference)
├── components/
├── pages/
└── ...
```

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Format code
npm run format
```

## 📝 Note

This project uses XRPL Testnet.
If the Testnet faucet is down, use preset accounts.

## 🔧 Key Features

- **Wallet Integration**: Connection with XAMAN wallet
- **Credential Management**: Create, accept, and delete digital credentials
- **Fund Management**: Investment and management features for PE funds
- **KYC Functionality**: Know Your Customer verification process
- **Responsive Design**: Mobile and desktop support