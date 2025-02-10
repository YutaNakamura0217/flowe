# ベースイメージ
FROM node:18-alpine

# コンテナ内の作業ディレクトリを指定
WORKDIR /flower-app/src/app

# package.json と package-lock.json を先にコピーして依存関係をインストール
COPY package*.json ./
RUN npm install

# アプリのソースコードをコピー
COPY . .

# Next.js をビルド (SSR 用の .next フォルダができる)
RUN npm run build

# Cloud Run はデフォルトでポート8080を期待しているので
# package.json の "start" スクリプトで 8080 ポートを使うようにします
# 例: "start": "next start -p 8080"

# 実際にコンテナ内で公開するポート (ドキュメント用)
EXPOSE 8080

# コンテナ起動時に「npm run start」を実行
CMD ["npm", "run", "start"]
