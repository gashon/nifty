# Dockerfile for react frontend

FROM node:16.15.0-alpine as build-deps

ARG DOPPLER_TOKEN

# Make directories
RUN mkdir -p /usr/src/apps
RUN mkdir -p /usr/src/apps/client
RUN mkdir -p /usr/src/apps/api-live
RUN mkdir -p /usr/src/apps/packages

WORKDIR /usr/src/apps

COPY ./apps/client ./client/
COPY ./apps/api-live ./api-live/

COPY ./packages ../packages

COPY package.json tailwind.config.js turbo.json ../

# install python
RUN apk add --no-cache python3

# Install build tools, including 'make'
RUN apk add --no-cache --virtual .build-deps alpine-sdk

RUN yarn install --non-interactive

# Install Doppler CLI
RUN apk add curl gnupg
RUN (curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh || wget -t 3 -qO- https://cli.doppler.com/install.sh) | sh

RUN cd ./client && doppler run -t $DOPPLER_TOKEN -- yarn build

FROM nginx:1.17.1-alpine

COPY --from=build-deps /usr/src/apps/client/.next /usr/share/nginx/html
COPY ./conf/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
