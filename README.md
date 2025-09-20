# Asian Private Equity Tokenization Platform

A platform that enables access to Asian private equity funds through tokenization on XRPL (XRP Ledger).

Additionally, by utilizing XRPL Credentials, the KYC (Know Your Customer) process is optimized.

## Core Features

1. User labeling through Credentials
2. Token-level PermissionedDomain configuration
3. Credentials management interface

### 1. User Labeling through Credentials

Traditional KYC (Know Your Customer) processes had the limitation of only providing simple "OK" or "NG" judgments. To solve this, we issue different **Credential Types (authentication information)** of **"High Status" or "Low Status"** based on KYC results.

Additionally, since Credentials have an expiration period, the system ensures that the latest status is always reflected through regular reviews.

<img width="1405" height="456" alt="Image" src="https://github.com/user-attachments/assets/f8eaa97a-c8e9-4a0f-90fb-e5220641c59e" />

### 2. Token-level PermissionedDomain Configuration

In private equity sales, it is common to carefully select customers based on legal requirements and strategic corporate objectives.

To address this, we perform user labeling through **Credentials (authentication information)**. This enables flexible grouping of Permissioned Domains (areas where access is permitted).

By configuring this Permissioned Domain for each token, it becomes possible to finely control the sales targets for tokens.

<img width="1020" height="848" alt="Image" src="https://github.com/user-attachments/assets/3fb38672-ff74-4eb6-8c84-c979a2952d2d" />

### 3. Credentials Management Interface

This interface allows centralized management of **Credentials (authentication information)** including issuance, deletion, and reference.

This improves operational efficiency for administrators. However, since Credentials are highly sensitive information, only authorized users should perform these operations.

## System Interaction Flow

1. (User) User registration through the marketplace user registration screen
2. (Fund) KYC process based on information received from users
3. (Fund) Credentials issuance based on KYC results
4. (User) Access to marketplace
5. (User) Credentials approval
6. (App) Display token information according to Credentials
7. (User) Transaction initiation

## Final Summary

The **Asian Private Equity Tokenization Platform** is a tokenization platform for Asian private equity funds based on XRPL (XRP Ledger). It solves traditional financial product transaction challenges through an advanced KYC (Know Your Customer) system utilizing XRPL Credentials.

---

Github: https://github.com/yohei-meister/rwa-token-app
Website: https://rwa-token-app-frontend.vercel.app/
Docs: https://docs.google.com/presentation/d/1gnUMARVsdUyTT74YMcjN8QWogByvAVH0/edit?usp=sharing&ouid=112366403428763619065&rtpof=true&sd=true
YouTube: https://youtu.be/gnwNdzkGx6A

