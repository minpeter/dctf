package leaderboard

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Routes(leaderboardRoutes *gin.RouterGroup) {

	leaderboardRoutes.GET("/graph", leaderboardGraphHandler)
	leaderboardRoutes.GET("/now", leaderboardNowHandler)

}

func leaderboardGraphHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func leaderboardNowHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}
