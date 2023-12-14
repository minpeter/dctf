package admin

import "github.com/gin-gonic/gin"

func Routes(adminRoutes *gin.RouterGroup) {
	challs := adminRoutes.Group("/challs")
	{
		challs.DELETE("/:id", deleteChallengeHandler)
		challs.GET("/:id", getChallengeHandler)
		challs.GET("", listChallengesHandler)
		challs.PUT("/:id", putChallengeHandler)
	}

	upload := adminRoutes.Group("/upload")
	{
		upload.POST("", uploadPostHandler)
		upload.POST("/query", uploadQueryHandler)
	}
}
