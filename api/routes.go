package api

import (
	"github.com/gin-gonic/gin"
	"github.com/minpeter/telos/api/admin"
	"github.com/minpeter/telos/api/auth"
	"github.com/minpeter/telos/api/challs"
	"github.com/minpeter/telos/api/leaderboard"
	"github.com/minpeter/telos/api/users"
)

func NewRouter() *gin.Engine {
	app := gin.Default()

	router := app.Group("/api")

	// Admin-related routes
	admin.Routes(router.Group("/admin"))

	// Authentication-related routes
	auth.Routes(router.Group("/auth"))

	// Challenge-specific routes
	challs.Routes(router.Group("/challs"))

	// Leaderboard-related routes
	leaderboard.Routes(router.Group("/leaderboard"))

	// User-related routes
	users.Routes(router.Group("/users"))

	return app
}
