package users

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/rctf-backend/auth"
	"github.com/minpeter/rctf-backend/utils"
)

func Routes(userRoutes *gin.RouterGroup) {

	userRoutes.GET("/:id", getUserHandler)

	me := userRoutes.Group("/me")
	{
		me.GET("", getMeHandler)
		me.PATCH("", updateMeHandler)

		auth := me.Group("/auth")
		{
			auth.DELETE("/ctftime", deleteCtftimeAuthHandler)
			auth.PUT("/ctftime", putCtftimeAuthHandler)
			auth.DELETE("/email", deleteEmailAuthHandler)
			auth.PUT("/email", putEmailAuthHandler)
		}

		members := me.Group("/members")
		{
			members.DELETE("/:id", deleteMemberHandler)
			members.GET("", listMembersHandler)
			members.POST("", newMemberHandler)
		}
	}
}

func getUserHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

// func getMeHandler(c *gin.Context) {
// 	user, err := database.Getuser("5f925ecc-89e3-4e2d-9b5d-1219e9abc8d1")
// 	if err != nil {
// 		log.Printf("Error getting user: %v", err)
// 		utils.SendResponse(c, "badUserData", nil)
// 		return
// 	}
// 	utils.SendResponse(c, "goodUserData", user)
// }

func getMeHandler(c *gin.Context) {

	// fmt.Println("token:", c.GetHeader("Authorization"))

	token := c.GetHeader("Authorization")

	data, err := auth.GetData(token)

	if err != nil {
		fmt.Println("Error getting user:", err)
		utils.SendResponse(c, "badUserData", nil)
		return
	}

	fmt.Println("data:", data)

	// utils.SendResponse(c, "goodUserData", gin.H{
	// 	"name":             "admin",
	// 	"ctftimeId":        nil,
	// 	"division":         "open",
	// 	"score":            20000,
	// 	"globalPlace":      nil,
	// 	"divisionPlace":    nil,
	// 	"solves":           []string{},
	// 	"teamToken":        "testToken",
	// 	"allowedDivisions": []string{"open"},
	// 	"id":               "5f925ecc-89e3-4e2d-9b5d-1219e9abc8d1",
	// 	"email":            "admin@admin.com",
	// })
}

func updateMeHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}
