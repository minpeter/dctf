FROM node:20-slim AS front-build

WORKDIR /app
COPY client/package.json client/yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean
COPY client .
RUN yarn build

FROM golang:1.21-alpine AS back-build

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o /app/server .

FROM alpine

WORKDIR /app
COPY client-config.json /app/client-config.json
COPY --from=front-build /app/out /app/client/out
COPY --from=back-build /app/server /app/server
EXPOSE 4000
CMD ./server
