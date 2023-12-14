package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// empty handler

func uploadPostHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func uploadQueryHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}
