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
RUN pnpm deploy --filter=api --prod /prod/api
RUN pnpm deploy --filter=api-live --prod /prod/api-live
RUN pnpm deploy --filter=web --prod /prod/web

# TODO containerize individual apps
FROM base AS api
EXPOSE 7000
WORKDIR /usr/src/app/apps/api
COPY --from=build /prod/api .
CMD [ "pnpm", "start" ]

FROM base AS api-live
WORKDIR /usr/src/app/apps/api-live
COPY --from=build /prod/api-live .
EXPOSE 8080
CMD [ "pnpm", "start" ]

FROM base AS web
WORKDIR /usr/src/app/apps/client
COPY --from=build /prod/web .
EXPOSE 3000
CMD [ "pnpm", "start" ]
