package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
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
	c.Status(http.StatusNoContent)
}
