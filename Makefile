include .env
export

.PHONY: help build run build-be run-be build-fe run-fe run-docker migrate-up migrate-down clean test

# Variables
APP_NAME := hris-app
VERSION := $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
BUILD_DIR := bin

# Default target
help:
	@echo "Available targets:"
	@echo "  help        - Show this help message"
	@echo "  build       - Build both backend and frontend"
	@echo "  run         - Run both backend and frontend locally"
	@echo "  build-be    - Build the application backend"
	@echo "  run-be      - Run the application backend"
	@echo "  build-fe    - Build the application frontend"
	@echo "  run-fe      - Run the application frontend"
	@echo "  run-docker  - Run the application using container"
	@echo "  migrate-up  - Run database migrations"
	@echo "  migrate-down- Rollback database migrations"
	@echo "  clean       - Clean build artifacts"
	@echo "  test        - Run tests"

# Build both services
build: build-be build-fe
	@echo "Build complete!"

# Run both services locally
run:
	@echo "Starting backend and frontend..."
	@make -j2 run-be run-fe

# Build BE
build-be:
	@echo "Building backend..."
	@cd backend && mkdir -p $(BUILD_DIR) && go build -o $(BUILD_DIR)/$(APP_NAME) ./cmd/api

# Run BE
run-be:
	@echo "Running backend..."
	@cd backend && go run ./cmd/api

# Build FE
build-fe:
	@echo "Building frontend..."
	@cd frontend && pnpm build

# Run FE
run-fe:
	@echo "Running frontend..."
	@cd frontend && pnpm dev 

# Run application both services
run-docker:
	@echo "Running $(APP_NAME)..."
	@docker compose up -d --build --force-recreate

# Run database migrations up
migrate-up:
	@echo "Running database migrations..."
	@migrate -path ./migrations -database "postgres://$(DB_USER):$(DB_PASSWORD)@$(DB_HOST):$(DB_PORT)/$(DB_NAME)?sslmode=$(DB_SSLMODE)" up

# Rollback database migrations
migrate-down:
	@echo "Rolling back database migrations..."
	@migrate -path ./migrations -database "postgres://$(DB_USER):$(DB_PASSWORD)@$(DB_HOST):$(DB_PORT)/$(DB_NAME)?sslmode=$(DB_SSLMODE)" down

# Create new migration
migrate-create:
	@if [ -z "$(NAME)" ]; then echo "Usage: make migrate-create NAME=migration_name"; exit 1; fi
	@migrate create -ext sql -dir ./migrations -seq $(NAME)

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf $(BUILD_DIR)

# Run tests
test:
	@echo "Running tests..."
	@go test -v ./...