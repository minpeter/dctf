package users

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func deleteEmailAuthHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func putEmailAuthHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}
