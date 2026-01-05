package routes

import (
	"hris-backend/internal/bootstrap"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Router struct {
	container *bootstrap.Container
	app       *echo.Echo
}

func NewRouter(container *bootstrap.Container) *Router {
	app := echo.New()

	return &Router{
		container: container,
		app:       app,
	}
}

func (r *Router) SetupMiddleware() {
	r.app.Use(middleware.Recover())
	r.app.Use(middleware.CORS())
}

func (r *Router) SetupRoutes() {
	r.app.GET("/health", r.container.HealthCheckHandler.HealthCheck)

	// api := r.app.Group("/api/v1")
	// {

	// }
}

func ServeHTTP(container *bootstrap.Container) *echo.Echo {
	router := NewRouter(container)

	router.SetupMiddleware()
	router.SetupRoutes()

	return router.app
}
