package bootstrap

import (
	"hris-backend/internal/config"
	"hris-backend/internal/infrastructure"
	"hris-backend/internal/modules/health"
)

type Container struct {
	Config  *config.Config
	DB      *infrastructure.GormConnectionProvider
	Storage *infrastructure.MinioStorageProvider

	HealthCheckHandler health.Handler
}

func NewContainer() (*Container, error) {
	cfg := config.Load()
	db := infrastructure.NewGormConnection(cfg)
	storage := infrastructure.NewMinioStorage(cfg)

	healthRepo := health.NewRepository(db.GetDB())
	healthSvc := health.NewService(healthRepo)
	healthHandler := health.NewHandler(healthSvc)

	return &Container{
		Config:  cfg,
		DB:      db,
		Storage: storage,

		HealthCheckHandler: *healthHandler,
	}, nil
}

// Close properly closes all resources
func (c *Container) Close() error {
	if c.DB != nil {
		return c.DB.Close()
	}

	return nil
}
