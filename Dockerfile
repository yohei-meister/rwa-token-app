FROM node:20-alpine

# ビルドに必要なツールを追加
RUN apk add --no-cache python3 g++ make

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
