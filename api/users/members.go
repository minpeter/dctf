package users

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/dctf-backend/utils"
)

func deleteMemberHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func listMembersHandler(c *gin.Context) {
	utils.SendResponse(c, "goodMemberData", []gin.H{})
}

func newMemberHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}
