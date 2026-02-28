# Этап 1: Сборка (Build)
FROM node:24-alpine AS builder

WORKDIR /app


# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем все зависимости (включая devDependencies для компиляции)
RUN npm install

# Копируем исходный код
COPY . .

# Собираем проект (генерирует папку dist)
RUN npm run build

# Этап 2: Продакшен (Production)
FROM node:24-alpine AS runner

WORKDIR /app

# Устанавливаем переменную окружения
ENV NODE_ENV=production

# Копируем только package.json и package-lock.json
COPY package*.json ./

# Устанавливаем ТОЛЬКО продакшен-зависимости
RUN npm install --only=production

# Копируем скомпилированный код из этапа builder
COPY --from=builder /app/dist ./dist

# Безопасность: запускаем приложение от имени не-root пользователя
USER node

# Команда запуска
CMD ["node", "dist/main"]