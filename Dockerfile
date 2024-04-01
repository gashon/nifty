FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

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
