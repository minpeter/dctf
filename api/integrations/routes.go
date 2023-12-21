package integrations

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/rctf-backend/utils"
)

func Routes(integrationRoutes *gin.RouterGroup) {

	client := integrationRoutes.Group("/client")
	{
		client.GET("/config", clientConfigHandler)
	}

	ctftime := integrationRoutes.Group("/ctftime")
	{
		ctftime.POST("/callback", ctftimeCallbackHandler)
		ctftime.GET("/leaderboard", ctftimeLeaderboardHandler)
	}

}

func clientConfigHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func ctftimeCallbackHandler(c *gin.Context) {

	utils.SendResponse(c, "goodCtftimeToken", gin.H{
		"ctftimeToken": "testtokentesttoken",
	})
}

func ctftimeLeaderboardHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}
