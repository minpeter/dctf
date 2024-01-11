
FROM golang:1.21-alpine AS build

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o /app/server .


FROM alpine
WORKDIR /app
COPY --from=build /app/server /app/server
EXPOSE 4000
CMD ./server
