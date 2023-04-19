# ---- Base Node ----
FROM node:16.15.0-alpine AS base
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json package-lock.json turbo.json yarn.lock tailwind.config.js ./

# ---- Dependencies ----
FROM base AS dependencies
ARG DOPPLER_CLIENT_TOKEN
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
ENV DOPPLER_CLIENT_TOKEN=$DOPPLER_CLIENT_TOKEN
ENV DOPPLER_API_TOKEN=$DOPPLER_API_TOKEN
WORKDIR /usr/src/app
EXPOSE 3000
EXPOSE 7000
EXPOSE 8080
CMD ["yarn", "apps:start"]
