FROM node:16-slim AS front-build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean
COPY . .
RUN yarn build

FROM golang:1.21-alpine AS back-build

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o /app/server .

FROM node:16-slim

WORKDIR /app
COPY package.json yarn.lock ./
ENV NODE_ENV production
RUN yarn install --prod --frozen-lockfile && yarn cache clean
COPY --from=front-build /app/build /app/build
COPY --from=back-build /app/server /app/server
EXPOSE 3000
CMD ./server
