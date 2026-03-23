FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx tsc

FROM node:22-alpine
RUN apk add --update tini
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build ./build

RUN npm ci --omit=dev && npm cache clean --force

EXPOSE 4000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "build/src/index.js"]