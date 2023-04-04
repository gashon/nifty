# ---- Base Node ----
FROM node:16.15.0-alpine AS base
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json turbo.json yarn.lock ./

# ---- Dependencies ----
FROM base AS dependencies
RUN apk add --no-cache --virtual .build-deps alpine-sdk
COPY ./apps ./apps
COPY ./packages ./packages

# ---- Builder ----
FROM dependencies AS builder
# install python
RUN apk add --no-cache python3
# Build tools including make
RUN apk add --no-cache --virtual .build-deps alpine-sdk
# Doppler CLI
RUN apk add curl gnupg
RUN (curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh || wget -t 3 -qO- https://cli.doppler.com/install.sh) | sh
# install deps
RUN yarn install --non-interactive

# ---- Api Build ----
FROM builder AS api
WORKDIR /usr/src/app/apps/api
EXPOSE 7000
ENTRYPOINT [ "doppler", "run", "-t","$DOPPLER_TOKEN", "--" ]
CMD [ "yarn", "start"]

# ---- Api-live Build ----
FROM builder AS api-live
WORKDIR /usr/src/app/apps/api-live
EXPOSE 8080
ENTRYPOINT [ "doppler", "run", "-t","$DOPPLER_TOKEN", "--" ]
CMD [ "yarn", "start"]

# ---- Client Build ----
FROM builder AS client
WORKDIR /usr/src/app/apps/client
EXPOSE 3000
ENTRYPOINT [ "doppler", "run", "-t","$DOPPLER_TOKEN", "--"]
# CMD ["./node_modules/.bin/next", "start"]
CMD ["sleep", "infinity"]
