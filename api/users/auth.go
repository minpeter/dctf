package users

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func deleteGithubAuthHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func putGithubAuthHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func deleteEmailAuthHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func putEmailAuthHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}
