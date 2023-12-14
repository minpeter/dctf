package users

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func deleteMemberHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func listMembersHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func newMemberHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}
