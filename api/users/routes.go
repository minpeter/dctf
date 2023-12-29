package users

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/dctf-backend/database"
	"github.com/minpeter/dctf-backend/utils"
)

func Routes(userRoutes *gin.RouterGroup) {

	userRoutes.GET("/:id", getUserHandler)

	me := userRoutes.Group("/me")
	{
		me.GET("", utils.TokenAuthMiddleware(), getMeHandler)
		me.PATCH("", utils.TokenAuthMiddleware(), updateMeHandler)

		auth := me.Group("/auth")
		{
			auth.DELETE("/email", deleteEmailAuthHandler)
			auth.PUT("/email", putEmailAuthHandler)
		}

	}
}

func getUserHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func getMeHandler(c *gin.Context) {

	user := c.MustGet("user").(database.User)

	fmt.Println("user:", user)

	solves, err := database.GetSolvesByUserId(user.Id)
	if err != nil {
		utils.SendResponse(c, "internalServerError", nil)
		return
	}

	solvesIds := []string{}

	for _, solve := range solves {
		solvesIds = append(solvesIds, solve.ChallengeId)
	}

	utils.SendResponse(c, "goodUserData", gin.H{
		"name":          user.Name,
		"githubId":      nil,
		"division":      "open",
		"score":         20000,
		"globalPlace":   nil,
		"divisionPlace": nil,
		"solves":        solvesIds,
		// "teamToken":        "testToken",
		"allowedDivisions": []string{"open"},
		"id":               user.Id,
		"email":            user.Email,
	})
}

func updateMeHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}
