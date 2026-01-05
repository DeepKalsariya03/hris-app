package health

import (
	"hris-backend/pkg/logger"

	"gorm.io/gorm"
)

type Repository interface {
	Check() error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) Check() error {
	sqlDB, err := r.db.DB()
	if err != nil {
		logger.Errorw("healthRepository.Check.db.DB() ERROR: ", err)
		return err
	}

	err = sqlDB.Ping()
	if err != nil {
		logger.Errorw("healthRepository.Check.sqlDB.Ping() ERROR: ", err)
		return err
	}

	return nil
}
