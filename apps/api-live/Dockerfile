FROM node:16.15.0-alpine

# Make directories
RUN mkdir -p /usr/src/apps
RUN mkdir -p /usr/src/apps/client
RUN mkdir -p /usr/src/apps/api-live
RUN mkdir -p /usr/src/apps/packages

# Set working directory
WORKDIR /usr/src/app

COPY ./apps/client ./client/
COPY ./apps/api-live ./api-live/
COPY ./apps/api ./api/

COPY ./packages ../packages

COPY package.json turbo.json ../

# Install build tools, including 'make'
RUN apk add --no-cache --virtual .build-deps alpine-sdk

RUN yarn install --non-interactive

# Install Doppler CLI
RUN apk add curl gnupg
RUN (curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh || wget -t 3 -qO- https://cli.doppler.com/install.sh) | sh

EXPOSE 7000

CMD [ "cd", "./api-live", "&&", "doppler", "run", "-t", "$DOPPLER_TOKEN", "--", "yarn", "start" ]

