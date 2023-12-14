package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/rctf-backend/utils"
)

func Routes(authRoutes *gin.RouterGroup) {

	authRoutes.POST("/login", loginHandler)
	authRoutes.POST("/recover", recoverHandler)
	authRoutes.POST("/register", registerHandler)
	authRoutes.GET("/test", testHandler)
	authRoutes.POST("/verify", verifyHandler)

}

func loginHandler(c *gin.Context) {

	utils.SendResponse(c, "goodLogin", gin.H{
		"authToken": "testAuthToken",
	})
}

func recoverHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func registerHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func testHandler(c *gin.Context) {
	utils.SendResponse(c, "goodTest", gin.H{})
}

func verifyHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}
