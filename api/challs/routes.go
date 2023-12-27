package challs

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/dctf-backend/database"
	"github.com/minpeter/dctf-backend/utils"
)

func Routes(challRoutes *gin.RouterGroup) {

	challRoutes.GET("", utils.TokenAuthMiddleware(), getChallsHandler)
	challRoutes.GET("/:id/solves", getChallSolvesHandler)
	challRoutes.POST("/:id/submit", utils.TokenAuthMiddleware(), submitChallHandler)

}

func getChallsHandler(c *gin.Context) {

	challs, err := database.GetAllChallenges()
	if err != nil {
		utils.SendResponse(c, "internalError", gin.H{})
		return
	}

	utils.SendResponse(c, "goodChallenges", challs)

	// utils.SendResponse(c, "goodChallenges", []gin.H{
	// 	{
	// 		"files":       []string{},
	// 		"description": "This is a good challenge",
	// 		"author":      "minpeter",
	// 		"points":      100,
	// 		"id":          "34344543-3453-345-5344-34534534534534",
	// 		"name":        "Good Challenge",
	// 		"category":    "pwn",
	// 		"solves":      2,
	// 	},
	// })
}

func getChallSolvesHandler(c *gin.Context) {

	c.Status(http.StatusNoContent)
}

func submitChallHandler(c *gin.Context) {

	utils.SendResponse(c, "badEnded", gin.H{})
}
