# Этап 1: Сборка (Build)
FROM node:22-alpine AS builder

WORKDIR /app

# Prisma требует OpenSSL на Alpine Linux
RUN apk add --no-cache openssl

COPY package*.json ./

RUN npm install

COPY . .

# Генерируем Prisma Client и компилируем TypeScript
RUN npx prisma generate && npm run build

# Этап 2: Продакшен (Production)
FROM node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma

RUN npm install --only=production && npx prisma generate

# Копируем скомпилированный код из этапа builder
COPY --from=builder /app/dist ./dist

USER node

# Точка входа — dist/index.js (из src/index.ts)
CMD ["sh", "-c", "npx prisma db push && node dist/index.js"]