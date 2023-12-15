package leaderboard

import (
	"github.com/gin-gonic/gin"
	"github.com/minpeter/rctf-backend/utils"
)

func Routes(leaderboardRoutes *gin.RouterGroup) {

	leaderboardRoutes.GET("/graph", leaderboardGraphHandler)
	leaderboardRoutes.GET("/now", leaderboardNowHandler)

}

func leaderboardGraphHandler(c *gin.Context) {
	utils.SendResponse(c, "goodLeaderboard", gin.H{"graph": []string{}})
}

func leaderboardNowHandler(c *gin.Context) {
	utils.SendResponse(c, "goodLeaderboard", gin.H{
		"total":       0,
		"loaderboard": []string{},
	})
}
