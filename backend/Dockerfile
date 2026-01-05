# Build stage
FROM golang:1.25.1 AS builder

WORKDIR /app

# Copy go.mod and go.sum first to cache dependencies
COPY go.mod go.sum ./

RUN go mod download

# Copy the rest of the application source code
COPY . .

# Build Go application
RUN CGO_ENABLED=0 GOOS=linux go build -o hris-be-service ./cmd/api

# Final stage
FROM alpine:3.11.3

WORKDIR /app

# Copy built binary from builder stage
COPY --from=builder /app/hris-be-service .

# Expose application port
EXPOSE 8080

# Run the executable
ENTRYPOINT ["./hris-be-service", "http"]