package main

import (
	"context"
	"fmt"
	"hris-backend/internal/bootstrap"
	"hris-backend/internal/routes"
	"hris-backend/pkg/logger"
	"log"
	"net/http"
	"os"
	"os/signal"
	"runtime"
	"time"

	"github.com/joho/godotenv"
)

const (
	httpServerMode = "http"
)

// @title HRIS Backend
// @version 1.0.0
// @description A REST API built with Go, Echo, and Clean Architecture
// @host localhost:8080
// @BasePath /api/v1
func main() {
	time.Local = time.UTC
	runtime.GOMAXPROCS(runtime.NumCPU())
	args := os.Args[1:]
	mode := httpServerMode
	if len(args) > 0 {
		mode = args[0]
	}

	switch mode {
	case httpServerMode:
		// Try to load .env file - first check parent directories, then current directory
		// This works both locally (with .env in root) and in Docker (env vars passed by compose)
		envPaths := []string{
			"../../../.env", // From backend/cmd/api to root
			"../../.env",    // From backend/cmd to root
			"../.env",       // From backend to root
			".env",          // Current directory
			"/app/.env",     // Docker container path
		}

		var loadErr error
		for _, path := range envPaths {
			if loadErr = godotenv.Load(path); loadErr == nil {
				break // Successfully loaded
			}
		}

		// Don't panic if .env is not found - in Docker, env vars are passed directly
		if loadErr != nil {
			fmt.Println("Warning: .env file not found (this is OK in Docker, env vars will be used)")
		}

		appContainer, err := bootstrap.NewContainer()
		if err != nil {
			log.Fatalf("Failed to initialize application container: %v", err)
		}
		defer appContainer.Close()

		logger.Info("Starting HRIS API Server...")

		appRouter := routes.ServeHTTP(appContainer)

		server := &http.Server{
			Addr:    fmt.Sprintf(":%d", appContainer.Config.Server.Port),
			Handler: appRouter,
		}

		sigCh := make(chan os.Signal, 1)
		signal.Notify(sigCh, os.Interrupt)

		go func() {
			if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
				logger.Errorw("Failed to to start server. Error: ", err)
			}
		}()

		<-sigCh

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		if err := server.Shutdown(ctx); err != nil {
			logger.Errorw("Failed to shutdown server. Error: ", err)
		}

		logger.Info("Server Shutdown Gracefully...")
	}

}
