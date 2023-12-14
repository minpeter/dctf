FROM node:16-slim AS build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

COPY . .
RUN yarn build

FROM node:16-slim
WORKDIR /app

COPY --from=build /app/yarn.lock /app/package.json /app/

ENV NODE_ENV production
RUN yarn install --prod --frozen-lockfile && yarn cache clean

COPY --from=build /app/dist /app/dist
COPY conf.d /app/conf.d
EXPOSE 4000

CMD ["node", "--enable-source-maps", "--unhandled-rejections=strict", "/app/dist/server/index.js"]
