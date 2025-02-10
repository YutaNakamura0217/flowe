# Dockerのベースイメージ
FROM node:18-alpine

# コンテナ内の作業ディレクトリを /app に設定
WORKDIR /app

# 1) flower-app フォルダ内の package.json & package-lock.json をコピー
COPY flower-app/package*.json ./

# 2) 依存関係をインストール
RUN npm install

# 3) flower-app フォルダの全ファイルをコピー (ソースコードやその他ファイル)
COPY flower-app ./

# 4) Next.js をビルド (SSR用の .next が生成される)
RUN npm run build

# 5) Cloud Run 等でポート8080を使う
EXPOSE 8080

# 6) コンテナ起動時に Next.js を起動
#    ※ package.json の "start" スクリプトで "next start -p 8080" を指定しておく
CMD ["npm", "run", "start"]
