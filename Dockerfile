# ---- Base Node ----
FROM node:16.15.0-alpine AS base
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json package-lock.json turbo.json yarn.lock tailwind.config.js ./

# ---- Dependencies ----
FROM base AS dependencies
RUN apk add --no-cache --virtual .build-deps alpine-sdk
# install python
RUN apk add --no-cache python3 
# Build tools including make
RUN apk add --no-cache --virtual .build-deps alpine-sdk 
# Doppler CLI
RUN apk add curl gnupg 
RUN (curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh || wget -t 3 -qO- https://cli.doppler.com/install.sh) | sh
COPY ./apps ./apps
COPY ./packages ./packages

# ---- Builder ----
FROM dependencies AS builder
ARG DOPPLER_CLIENT_TOKEN
# install deps
RUN yarn install --no-interactive
# build client
RUN yarn apps:build

# ---- App Build --- 
FROM builder as app
WORKDIR /usr/src/app
EXPOSE 3000
EXPOSE 7000
EXPOSE 8080
CMD ["yarn", "apps:start"]

# ---- App BUild --- 
FROM builder as app-dev
WORKDIR /usr/src/app
EXPOSE 3000
EXPOSE 7000
EXPOSE 8080
CMD ["yarn", "apps:dev"]

# ---- Api Build ----
FROM builder AS api
WORKDIR /usr/src/app/apps/api
EXPOSE 7000
CMD doppler run -t $DOPPLER_TOKEN -- yarn start

# ---- Api-live Build ----
FROM builder AS api-live
WORKDIR /usr/src/app/apps/api-live
EXPOSE 8080
CMD doppler run -t $DOPPLER_TOKEN -- yarn start

# ---- Client Build ----
FROM builder AS client
WORKDIR /usr/src/app/apps/client
EXPOSE 3000
CMD doppler run -t $DOPPLER_TOKEN -- ./node_modules/.bin/next build && doppler run -t $DOPPLER_TOKEN -- ./node_modules/.bin/next start

# ---- Client dev ----
FROM builder AS client-dev
WORKDIR /usr/src/app/apps/client
EXPOSE 3000
CMD doppler run -t $DOPPLER_TOKEN -- ./node_modules/.bin/next dev

# ---- Api dev ----
FROM builder AS api-dev
WORKDIR /usr/src/app/apps/client
EXPOSE 7000
CMD doppler run -t $DOPPLER_TOKEN -- yarn dev

# ---- Api-live dev ----
FROM builder AS api-live-dev
WORKDIR /usr/src/app/apps/api-live
EXPOSE 8080
CMD doppler run -t $DOPPLER_TOKEN -- yarn dev