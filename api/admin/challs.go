package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/dctf-backend/database"
	"github.com/minpeter/dctf-backend/utils"
)

func deleteChallengeHandler(c *gin.Context) {
	id := c.Param("id")

	if err := database.DeleteChallenge(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	utils.SendResponse(c, "goodChallengeDelete", gin.H{})
}

func listChallengesHandler(c *gin.Context) {

	challs, err := database.GetAllChallenges()
	if err != nil {
		utils.SendResponse(c, "internalError", gin.H{})
		return
	}

	utils.SendResponse(c, "goodChallenges", challs)
}

func putChallengeHandler(c *gin.Context) {
	// body에서 database.Challeng를 읽음
	// database.CreateChallenge를 호출

	var req struct {
		Data database.Challenge `json:"data"`
	}

	id := c.Param("id")

	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	req.Data.Id = id

	if err := database.CreateChallenge(req.Data); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if req.Data.Files == nil {
		req.Data.Files = []database.File{}
	}

	c.JSON(http.StatusOK, req)
}
