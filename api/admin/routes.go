package admin

import (
	"github.com/gin-gonic/gin"
	"github.com/minpeter/dctf-backend/utils"
	"github.com/minpeter/dctf-backend/utils/perms"
)

func Routes(adminRoutes *gin.RouterGroup) {

	adminRoutes.Use(utils.TokenAuthMiddleware(perms.Admin))
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
