FROM node:current-alpine
# TODO check which are actually secrets or what can be passed in docker-compose
# Setting environment variables coming from the GitHub actions secrets
RUN --mount=type=secret,id=EXPIRATION_TIME \
  --mount=type=secret,id=GMAIL_ACCOUNT \
  --mount=type=secret,id=GMAIL_PWD \
  --mount=type=secret,id=MONGODB_URI \
  --mount=type=secret,id=PRIVATE_KEY \
  --mount=type=secret,id=SLACK_HOOK_URL \
   export API_ENDPOINT=$(cat /run/secrets/EXPIRATION_TIME) && \
   export API_PASSWORD=$(cat /run/secrets/GMAIL_ACCOUNT) && \
   export API_ENDPOINT=$(cat /run/secrets/GMAIL_PWD) && \
   export API_ENDPOINT=$(cat /run/secrets/MONGODB_URI) && \
   export API_ENDPOINT=$(cat /run/secrets/PRIVATE_KEY) && \
   export API_ENDPOINT=$(cat /run/secrets/SLACK_HOOK_URL)
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
