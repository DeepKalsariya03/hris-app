package utils

import (
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type CustomValidator struct {
	Validator *validator.Validate
}

type ErrorResponse struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

func (cv *CustomValidator) Validate(i interface{}) error {
	if err := cv.Validator.Struct(i); err != nil {
		var errors []ErrorResponse

		for _, err := range err.(validator.ValidationErrors) {
			var msg string
			switch err.Tag() {
			case "required":
				msg = fmt.Sprintf("%s is required", err.Field())
			case "min":
				msg = fmt.Sprintf("%s must be at least %s characters", err.Field(), err.Param())
			case "eqfield":
				msg = fmt.Sprintf("%s must be equal to %s", err.Field(), err.Param())
			case "nefield":
				msg = fmt.Sprintf("%s cannot be the same as %s", err.Field(), err.Param())
			default:
				msg = fmt.Sprintf("%s is invalid", err.Field())
			}

			errors = append(errors, ErrorResponse{
				Field:   err.Field(),
				Message: msg,
			})
		}

		return echo.NewHTTPError(http.StatusBadRequest, map[string]interface{}{
			"message": "Validation failed",
			"errors":  errors,
		})
	}
	return nil
}

func NewValidator() *CustomValidator {
	return &CustomValidator{Validator: validator.New()}
}
