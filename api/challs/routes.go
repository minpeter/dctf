package challs

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Routes(challRoutes *gin.RouterGroup) {

	challRoutes.GET("", getChallsHandler)
	challRoutes.GET("/:id/solves", getChallSolvesHandler)
	challRoutes.POST("/:id/submit", submitChallHandler)

}

func getChallsHandler(c *gin.Context) {

	c.Status(http.StatusNoContent)
}

func getChallSolvesHandler(c *gin.Context) {

	c.Status(http.StatusNoContent)
}

func submitChallHandler(c *gin.Context) {

	c.Status(http.StatusNoContent)
}
