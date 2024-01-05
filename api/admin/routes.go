package admin

import (
	"github.com/gin-gonic/gin"
	"github.com/minpeter/telos-backend/utils"
	"github.com/minpeter/telos-backend/utils/perms"
)

func Routes(adminRoutes *gin.RouterGroup) {

	adminRoutes.Use(utils.TokenAuthMiddleware(perms.Admin))

	adminRoutes.GET("/check", checkHandler)
	challs := adminRoutes.Group("/challs")

	{
		challs.DELETE("/:id", deleteChallengeHandler)
		challs.GET("", listChallengesHandler)
		challs.PUT("/:id", putChallengeHandler)
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
