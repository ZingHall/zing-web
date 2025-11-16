####
## Base
####
FROM node:22-bookworm-slim AS base

# Install necessary packages for health check and other dependencies
RUN apt-get update && apt-get install -y \
    openssl \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

####
## Dependencies
####
FROM base AS deps

ARG GH_TOKEN
ARG REPO_OWNER
ARG NODE_ENV=production

WORKDIR /app

# 條件性設置 GitHub token（如果存在）
RUN if [ -n "$GH_TOKEN" ]; then \
    npm config set //npm.pkg.github.com/:_authToken $GH_TOKEN && \
    npm config set @${REPO_OWNER}:registry https://npm.pkg.github.com; \
    fi

# 複製 package 文件
COPY package.json yarn.lock ./

# 安裝依賴（包括 devDependencies 用於構建）
RUN yarn install --frozen-lockfile --production=false

####
## Builder
####
FROM base AS builder

ARG BUILD
ARG NEXT_PUBLIC_ENV
ARG NODE_ENV=production

WORKDIR /app

# 複製依賴
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 設置環境變數
ENV NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_ENV=$NEXT_PUBLIC_ENV
ENV NEXT_TELEMETRY_DISABLED=1

# 構建應用
RUN yarn build

####
## Runner
####
FROM base AS runner

ARG BUILD
ARG PORT=3000
ARG NODE_ENV=production

# 設置環境變數
ENV BUILD=$BUILD
ENV NODE_ENV=$NODE_ENV
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=$PORT

WORKDIR /app

# 創建非 root 用戶
RUN groupadd --gid 1001 --system nodejs && \
    useradd --uid 1001 --system --gid nodejs nodejs

# 創建必要的目錄並設置權限
RUN mkdir -p .next/static && \
    chown -R nodejs:nodejs /app

# 複製 standalone 輸出
COPY --from=builder --chown=nodejs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nodejs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nodejs:nodejs /app/public ./public

# 切換到非 root 用戶
USER nodejs

# 暴露端口
EXPOSE $PORT

# 啟動命令
CMD ["node", "server.js"]
