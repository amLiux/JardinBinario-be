# syntax=docker/dockerfile:1
FROM node:current-alpine
# ENV variables
ARG EXPIRATION_TIME
ENV EXPIRATION_TIME=${EXPIRATION_TIME}
ARG GMAIL_ACCOUNT
ENV GMAIL_ACCOUNT=${GMAIL_ACCOUNT}
ARG GMAIL_PWD
ENV GMAIL_PWD=${GMAIL_PWD}
ARG MONGODB_URI
ENV MONGODB_URI=${MONGODB_URI}
ARG PRIVATE_KEY
ENV PRIVATE_KEY=${PRIVATE_KEY}
ARG SLACK_HOOK_URL
ENV SLACK_HOOK_URL=${SLACK_HOOK_URL}

# done with ENV variables
RUN apk add --update tini
RUN mkdir -p /usr/jardinbinario/app
WORKDIR /usr/jardinbinario/app
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci --only-production && npm cache clean --force

COPY . .
RUN npx tsc

EXPOSE 4000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "build/src/index.js"]
