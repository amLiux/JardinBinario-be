FROM node:current-alpine
# TODO check which are actually secrets or what can be passed in docker-compose
# Setting environment variables coming from the GitHub actions secrets
RUN --mount=type=secret,id=EXPIRATION_TIME \
  --mount=type=secret,id=GMAIL_ACCOUNT \
  --mount=type=secret,id=GMAIL_PWD \
  --mount=type=secret,id=MONGODB_URI \
  --mount=type=secret,id=PRIVATE_KEY \
  --mount=type=secret,id=SLACK_HOOK_URL \
  EXPIRATION_TIME=$(cat /run/secrets/EXPIRATION_TIME) && \
  GMAIL_ACCOUNT=$(cat /run/secrets/GMAIL_ACCOUNT) && \
  GMAIL_PWD=$(cat /run/secrets/GMAIL_PWD) && \
  MONGODB_URI=$(cat /run/secrets/MONGODB_URI) && \
  PRIVATE_KEY=$(cat /run/secrets/PRIVATE_KEY) && \
  SLACK_HOOK_URL=$(cat /run/secrets/SLACK_HOOK_URL) \
  && export EXPIRATION_TIME \
  && export GMAIL_ACCOUNT \
  && export GMAIL_PWD \
  && export MONGODB_URI \
  && export PRIVATE_KEY \
  && export SLACK_HOOK_URL
# Environment variables done
RUN apk add --update tini
RUN mkdir -p /usr/jardinbinario/app
WORKDIR /usr/jardinbinario/app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci
COPY . .
EXPOSE 4000
CMD ["npm", "run", "start:js"]
