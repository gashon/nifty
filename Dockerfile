FROM node:16.15.0-alpine AS base
RUN apk add --no-cache python3 make g++
RUN npm uninstall -g pnpm
RUN curl -fsSL https://get.pnpm.io/v8.15.5.js | node - add --global pnpm@8.15.5
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
# install doppler cli
RUN apk add curl gnupg
RUN (curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh || wget -t 3 -qO- https://cli.doppler.com/install.sh) | sh

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=api --prod /prod/api
RUN pnpm deploy --filter=api-live --prod /prod/api-live

FROM base AS api
COPY --from=build /prod/api /prod/api
WORKDIR /prod/api
EXPOSE 7000
CMD [ "pnpm", "start" ]

FROM base AS api-live
COPY --from=build /prod/api-live /prod/api-live
WORKDIR /prod/api-live
EXPOSE 8080
CMD [ "pnpm", "start" ]
