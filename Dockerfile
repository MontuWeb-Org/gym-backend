FROM node:lts-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
  npm ci --ignore-scripts

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

RUN npm prune --omit=dev --ignore-scripts

# For prisma runtime files
COPY ./tsconfig.json ./tsconfig.json

FROM node:lts-alpine AS runner

RUN npm install -g ts-node typescript
RUN npm install -D @types/node

WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node ./dist/src/main.js"]
