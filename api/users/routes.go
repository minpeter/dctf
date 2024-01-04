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

	// solves.push({
	// 	category: chall.category,
	// 	name: chall.name,
	// 	points: challengeInfo[i].score,
	// 	solves: challengeInfo[i].solves,
	// 	id: chall.id,
	// 	createdAt: solve.createdat.valueOf()
	// })

	solvesResp := []struct {
		Category  string `json:"category"`
		Name      string `json:"name"`
		Points    int    `json:"points"`
		Solves    int    `json:"solves"`
		Id        string `json:"id"`
		CreatedAt int64  `json:"createdAt"`
	}{}

	for _, solve := range solves {
		solvesResp = append(solvesResp, struct {
			Category  string `json:"category"`
			Name      string `json:"name"`
			Points    int    `json:"points"`
			Solves    int    `json:"solves"`
			Id        string `json:"id"`
			CreatedAt int64  `json:"createdAt"`
		}{
			// Category:  solve.Category,
			// Name:      solve.Name,
			// Points:    solve.Points,
			// Solves:    solve.Solves,
			Category:  "a",
			Name:      "a",
			Points:    0,
			Solves:    1,
			Id:        solve.Challengeid,
			CreatedAt: solve.CreatedAt.Unix(),
		})
	}

	utils.SendResponse(c, "goodUserData", gin.H{
		"name":          user.Name,
		"githubId":      nil,
		"division":      "open",
		"score":         20000,
		"globalPlace":   nil,
		"divisionPlace": nil,
		"solves":        solvesResp,
		// "teamToken":        "testToken",
		"allowedDivisions": []string{"open"},
		"id":               user.Id,
		"email":            user.Email,
	})
}

func updateMeHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}
