FROM node:22.3-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
RUN pnpm install --global pnpm@9.4.0
WORKDIR /usr/src/app
COPY . .
# TODO mount with docker buildkit
RUN pnpm install
RUN pnpm run build

FROM build AS prod
EXPOSE 7000 8080 3000
CMD [ "pnpm", "start" ]

