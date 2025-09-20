# Node.js 22 Alpine ベース
FROM node:22-alpine


# 開発に必要なツールを追加
RUN apk add --no-cache bash

# 作業ディレクトリ
WORKDIR /app

# 依存関係インストール用に package.json を先にコピー
COPY package*.json ./

# npm install
RUN npm install

# ソースコードをコピー（開発用はボリュームマウントで上書きされる）
COPY . .

# Next.js 開発サーバー用ポート
EXPOSE 3000

# 開発モードで起動（ホスト0.0.0.0で外部アクセス可能）
CMD ["npm", "run", "dev"]