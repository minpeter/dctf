FROM --platform=$BUILDPLATFORM node:20 AS front-build

WORKDIR /app
RUN corepack enable
COPY ui/package.json ui/pnpm-lock.yaml ./
RUN pnpm install
COPY ui .
RUN pnpm build

FROM --platform=$BUILDPLATFORM golang:1.21-alpine AS back-build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
ARG TARGETOS TARGETARCH 
ENV CGO_ENABLED=0
RUN GOOS=$TARGETOS GOARCH=$TARGETARCH go build -o /app/server .

FROM alpine
WORKDIR /app
COPY --from=back-build /app/server /app/server
COPY --from=front-build /app/out /app/ui/out
EXPOSE 4000
CMD ./server
