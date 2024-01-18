package admin

import (
	"github.com/gin-gonic/gin"
	"github.com/minpeter/telos/auth"
	"github.com/minpeter/telos/auth/perms"
	"github.com/minpeter/telos/utils"
)

func Routes(adminRoutes *gin.RouterGroup) {

	adminRoutes.Use(auth.AuthTokenMiddleware(perms.Admin))

	adminRoutes.GET("/check", checkHandler)
	challs := adminRoutes.Group("/challs")
	chall := adminRoutes.Group("/chall")

	{
		challs.GET("", listChallengesHandler)
		challs.DELETE("", deleteChallengesHandler)
	}

	{
		chall.POST("", createChallengeHandler)
		chall.DELETE("/:id", deleteChallengeHandler)
		chall.PUT("/:id", updateChallengeHandler)
	}

	upload := adminRoutes.Group("/upload")
	{
		upload.POST("", uploadPostHandler)
		upload.POST("/query", uploadQueryHandler)
	}
}

func checkHandler(c *gin.Context) {
	utils.SendResponse(c, "goodAdminCheck", nil)
}
