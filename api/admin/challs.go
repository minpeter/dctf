package admin

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/telos/database"
	"github.com/minpeter/telos/utils"
)

func listChallengesHandler(c *gin.Context) {

	challs, err := database.GetAllChallenges()
	if err != nil {
		utils.SendResponse(c, "internalError", gin.H{})
		return
	}

	if challs == nil {
		challs = []database.Challenge{}
	}

	utils.SendResponse(c, "goodChallenges", challs)
}

func deleteChallengesHandler(c *gin.Context) {
	// body에 string []안에 id들이 들어있음
	var req struct {
		Ids []string `json:"ids"`
	}

	if err := c.BindJSON(&req); err != nil {
		utils.SendResponse(c, "badRequest", gin.H{})
		return
	}

	for _, id := range req.Ids {
		if err := database.DeleteChallenge(id); err != nil {
			utils.SendResponse(c, "internalError", gin.H{})
			return
		}
		fmt.Println("deleted", id)
	}

	utils.SendResponse(c, "goodChallengesDelete", gin.H{})
}
