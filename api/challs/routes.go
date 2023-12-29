package challs

import (
	"fmt"
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

	challs, err := database.GetCleanedChallenges()
	if err != nil {
		utils.SendResponse(c, "internalError", gin.H{})
		return
	}

	utils.SendResponse(c, "goodChallenges", challs)
}

func getChallSolvesHandler(c *gin.Context) {

	c.Status(http.StatusNoContent)
}

func submitChallHandler(c *gin.Context) {

	ChallengeId := c.Param("id")

	var req struct {
		Flag string `json:"flag" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendResponse(c, "badRequest", gin.H{})
		return
	}

	challenge, err := database.GetChallengeById(ChallengeId)
	if err != nil {
		utils.SendResponse(c, "badChallenge", gin.H{})
		return
	}

	fmt.Println(req.Flag)
	fmt.Println(challenge.Flag)

	if req.Flag == challenge.Flag {

		solver := database.Solve{
			Challengeid: ChallengeId,
			Userid:      c.MustGet("userid").(string),
		}

		err := database.NewSolve(solver)
		if err != nil {
			utils.SendResponse(c, "internalError", gin.H{})
			return
		}

		utils.SendResponse(c, "goodFlag", gin.H{})
		return
	}

	utils.SendResponse(c, "badFlag", gin.H{})
}
