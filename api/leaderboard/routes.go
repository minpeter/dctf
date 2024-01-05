package leaderboard

import (
	"github.com/gin-gonic/gin"
	"github.com/minpeter/telos/utils"
)

func Routes(leaderboardRoutes *gin.RouterGroup) {

	leaderboardRoutes.GET("/graph", leaderboardGraphHandler)
	leaderboardRoutes.GET("/now", leaderboardNowHandler)

}

func leaderboardGraphHandler(c *gin.Context) {
	utils.SendResponse(c, "goodLeaderboard", gin.H{"graph": []gin.H{
		{
			"id":   "502ca3a8-b1e8-48f0-9539-5d1734369e67",
			"name": "K3su4l_H3ck3r",
			"points": []gin.H{
				{
					"time":  1702900800000,
					"score": 7527,
				},
				{
					"time":  1702900800000,
					"score": 7527,
				},
				{
					"time":  1702899000000,
					"score": 7539,
				},
				{
					"time":  1702897200000,
					"score": 7547,
				},
				{
					"time":  1702895400000,
					"score": 7555,
				},
			},
		},
	}})
}

func leaderboardNowHandler(c *gin.Context) {
	utils.SendResponse(c, "goodLeaderboard", gin.H{
		"total": 4,
		"leaderboard": []gin.H{
			{
				"id":    "502ca3a8-b1e8-48f0-9539-5d1734369e67",
				"name":  "K3su4l_H3ck3r",
				"score": 7527,
			},
			{
				"id":    "19a4fd3c-9390-46b9-af57-a29b2093e1f9",
				"name":  "8n1ck3r_d00dl3",
				"score": 6143,
			},
			{
				"id":    "83d5299e-7fc8-48cc-b399-8effe45c1a8e",
				"name":  "breaker of chains",
				"score": 6080,
			},
			{
				"id":    "a4545d1a-ce32-41a5-ae19-9e050988bad2",
				"name":  "Th3_0rd3r_of_Wh!t3_1otu5",
				"score": 5294,
			},
		},
	})
}
