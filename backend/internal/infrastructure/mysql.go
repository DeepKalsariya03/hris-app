package infrastructure

import (
	"fmt"
	"hris-backend/internal/config"
	"hris-backend/pkg/logger"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	gormLogger "gorm.io/gorm/logger"
)

type GormConnectionProvider struct {
	DB *gorm.DB
}

func NewGormConnection(cfg *config.Config) *GormConnectionProvider {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=UTC",
		cfg.Database.User, cfg.Database.Password, cfg.Database.Host, cfg.Database.Port, cfg.Database.DBName)

	// Configure GORM logger
	gormLogger := gormLogger.Default.LogMode(gormLogger.Info)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: gormLogger,
		NowFunc: func() time.Time {
			return time.Now().UTC()
		},
	})
	if err != nil {
		logger.Errorw("Failed to connect to database:", err)
	}

	logger.Info("Connected to Database")

	return &GormConnectionProvider{
		DB: db,
	}
}

func (g *GormConnectionProvider) Close() error {
	sqlDB, err := g.DB.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}

// GetDB returns the GORM database connection
func (g *GormConnectionProvider) GetDB() *gorm.DB {
	return g.DB
}
