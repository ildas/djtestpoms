FROM golang:1.18 as build

WORKDIR /build

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o /app ./poms-server

FROM scratch 
COPY --from=build /app /app
EXPOSE 8080
ENTRYPOINT ["/app"]
