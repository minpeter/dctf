package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/dctf-backend/database"
)

func deleteChallengeHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func getChallengeHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func listChallengesHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
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
	c.JSON(http.StatusOK, req)
}
