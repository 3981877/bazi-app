FROM node:18-alpine AS base

# 安装依赖阶段
FROM base AS deps
WORKDIR /app

# 复制package.json和package-lock.json
COPY package.json package-lock.json* ./

# 安装依赖
RUN npm ci

# 构建阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建应用
RUN npm run build

# 运行阶段
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# 创建非root用户运行应用
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制必要文件
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 切换到非root用户
USER nextjs

# 暴露3000端口
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME 0.0.0.0

# 启动应用
CMD ["node", "server.js"] 