# HRIS App

A modern, full-stack Human Resource Information System (HRIS) built with clean architecture principles, featuring a React frontend and Go backend.

## Overview

HRIS App is a comprehensive HR management system designed to streamline human resources operations. The application follows best practices in software architecture, providing a scalable and maintainable solution for managing employee data, authentication, and file storage.

## Tech Stack

### Frontend

- **React 19.2.0** - Latest React with enhanced performance
- **TypeScript 5.9.3** - Type-safe development
- **Vite 7.2.4** - Lightning-fast build tool
- **TailwindCSS 3.4.17** - Utility-first styling
- **TanStack Query** - Powerful data fetching and caching
- **React Router DOM** - Client-side routing
- **Radix UI** - Accessible component primitives

### Backend

- **Go 1.25.1** - High-performance backend
- **Echo v4** - Minimalist web framework
- **MySQL 8.0** - Relational database
- **GORM** - ORM for database operations
- **MinIO** - S3-compatible object storage
- **Zap** - Structured logging
- **golang-migrate** - Database migration tool

### Infrastructure

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Features

- 🔐 Secure authentication with JWT
- 📁 File upload and management with MinIO
- 🗄️ Database migrations with version control
- 🎨 Modern, responsive UI with dark mode support
- 🔍 Health check endpoints
- 📊 Clean architecture for maintainability
- 🐳 Docker-based deployment
- 🔧 Environment-based configuration

## Quick Start with Docker Compose (Recommended)

The fastest way to run the complete application stack.

### Prerequisites

- Docker and Docker Compose installed
- Git

### Step 1: Clone and Configure

```bash
# Clone the repository
git clone <repository-url>
cd hris-app

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Default values work for local development
```

### Step 2: Start All Services

```bash
# Start all services (database, storage, backend, frontend)
docker compose up -d --build

# Or use the Makefile
make run-docker
```

This will start:

- **MySQL Database** on port `3306`
- **MinIO Storage** on ports `9000` (API) and `9001` (Console)
- **Backend API** on port `8081`
- **Frontend** on port `8080` (via nginx)

### Step 3: Access the Application

- **Frontend Application**: http://localhost:8080
- **Backend API**: http://localhost:8081
- **Health Check**: http://localhost:8081/health
- **MinIO Console**: http://localhost:9001

### Step 4: Verify Services

```bash
# Check all containers are running
docker compose ps

# View logs
docker compose logs -f

# Check specific service logs
docker compose logs -f backend
docker compose logs -f frontend
```

### Stop Services

```bash
# Stop all services
docker compose down

# Stop and remove volumes (deletes data)
docker compose down -v
```

## Local Development

For active development with hot-reload and faster iteration.

### Prerequisites

- **Backend**: Go 1.25.1+
- **Frontend**: Node.js 18+ and pnpm
- **Database**: MySQL 8.0 (or use Docker)
- **Storage**: MinIO (optional, can use Docker)

### Backend Setup

```bash
cd backend

# Install dependencies
go mod download

# Run database migrations
migrate -path ./migrations -database "mysql://user:password@tcp(localhost:3306)/hris_db" up

# Run backend (hot-reload enabled)
go run cmd/api/main.go

# Or use Makefile from root
make run-be
```

Backend runs on http://localhost:8080

### Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Or use Makefile from root
make run-fe
```

Frontend runs on http://localhost:5173

### Run Both Services (Using Makefile)

```bash
# Build both services
make build

# Run both backend and frontend concurrently
make run
```

## Project Structure

```
hris-app/
├── backend/                 # Go backend service
│   ├── cmd/                # Application entry points
│   ├── internal/           # Private application code
│   │   ├── bootstrap/     # Dependency injection
│   │   ├── config/        # Configuration management
│   │   ├── infrastructure/# External services
│   │   ├── modules/       # Business logic modules
│   │   └── routes/        # HTTP routing
│   ├── pkg/               # Public/reusable packages
│   ├── migrations/        # Database migrations
│   └── Dockerfile         # Backend container definition
│
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── features/      # Feature modules
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities
│   │   └── types/         # TypeScript types
│   └── Dockerfile         # Frontend container definition
│
├── docker-compose.yml      # Multi-container orchestration
├── Makefile               # Build and run commands
├── .env.example           # Environment variables template
└── README.md              # This file
```

## Available Commands

The project includes a Makefile for common tasks:

```bash
make help              # Show all available commands
make build             # Build both backend and frontend
make run               # Run both services locally (concurrent)
make build-be          # Build backend only
make run-be            # Run backend only
make build-fe          # Build frontend only
make run-fe            # Run frontend only
make run-docker        # Run all services with Docker
make migrate-up        # Run database migrations
make migrate-down      # Rollback migrations
make clean             # Clean build artifacts
make test              # Run tests
```

## Environment Variables

Key environment variables (see `.env.example` for complete list):

### Database

```env
MYSQL_HOST=db
...
```

### Backend

```env
SERVER_PORT=8080
...
```

### Frontend

```env
VITE_API_URL=http://localhost:8080
...
```

### MinIO Storage

```env
MINIO_ENDPOINT=minio:9000
...
```

## Development Workflow

1. **Feature Development**

   - Create feature branches from `main`
   - Follow clean architecture principles
   - Write tests for new features

2. **Database Changes**

   - Create migration files
   - Test migrations locally
   - Run migrations in Docker environment

3. **Code Quality**
   - Follow Go and TypeScript best practices
   - Run linting and tests
   - Ensure clean commits

## Detailed Documentation

For more detailed information about each service:

- **Backend**: [backend/README.md](./backend/README.md)

  - Architecture details
  - API documentation
  - Development guidelines
  - Troubleshooting

- **Frontend**: [frontend/README.md](./frontend/README.md)
  - Component architecture
  - State management
  - Styling guidelines
  - Build configuration

## Troubleshooting

### Docker Services Won't Start

```bash
# Check port conflicts
netstat -tuln | grep -E ':(3306|8080|9000|9001)'

# View service logs
docker compose logs [service-name]

# Rebuild containers
docker compose up -d --build --force-recreate
```

### Database Connection Issues

```bash
# Check database health
docker compose exec db mysql -u hris_user -p hris_db

# Restart database
docker compose restart db

# Check migrations
docker compose logs migrate
```

### Frontend Build Errors

```bash
# Clear node modules and reinstall
cd frontend
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check for TypeScript errors
pnpm lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

[MIT LICENSE](https://github.com/PickHD/hris-app/blob/main/LICENSE)

## Support

For issues, questions, or contributions, please open an issue on GitHub.
