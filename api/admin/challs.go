package admin

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/telos/database"
	"github.com/minpeter/telos/utils"
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

	if challs == nil {
		challs = []database.Challenge{}
	}

	utils.SendResponse(c, "goodChallenges", challs)
}

func putChallengeHandler(c *gin.Context) {
	var req struct {
		Data database.Challenge `json:"data"`
	}

	id := c.Param("id")

	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Println(req.Data)

	req.Data.Id = id

	if err := database.PutChallenge(req.Data); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if req.Data.Files == nil {
		req.Data.Files = []database.File{}
	}

	c.JSON(http.StatusOK, req)
}
