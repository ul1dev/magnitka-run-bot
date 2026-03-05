FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --fetch-retries=5 --fetch-retry-mintimeout=10000 --fetch-retry-maxtimeout=60000

COPY nest-cli.json ./
COPY tsconfig*.json ./
COPY src ./src

RUN npm run build

# ── production image ──────────────────────────────────────
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev --fetch-retries=5 --fetch-retry-mintimeout=10000 --fetch-retry-maxtimeout=60000

COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/logs
RUN chown -R node:node /app

USER node

ARG PORT=8080
EXPOSE ${PORT}

CMD ["node", "dist/main"]
