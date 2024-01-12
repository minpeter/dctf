FROM node:20-slim AS front-build

WORKDIR /app
COPY ui/package.json ui/yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean
COPY ui .
RUN yarn build

FROM golang:1.21-alpine AS back-build

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o /app/server .

FROM alpine

WORKDIR /app
COPY --from=front-build /app/out /app/ui/out
COPY --from=back-build /app/server /app/server
EXPOSE 4000
CMD ./server
