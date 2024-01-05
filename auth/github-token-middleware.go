package auth

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/telos/database"
	"github.com/minpeter/telos/utils"
)

func GithubTokenMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		cookie, err := c.Cookie("githubToken")
		if err != nil {
			log.Printf("cookie error: %s", err.Error())
			utils.SendResponse(c, "badToken", nil)
			c.Abort()
			return
		}

		githubData, err := GetData(Github, Token(cookie))
		if err != nil {
			utils.SendResponse(c, "badToken", nil)
			c.Abort()
			return
		}

		_, has, err := database.GetuserByGithubId(githubData.Github.GithubID)
		if err != nil {
			utils.SendResponse(c, "badToken", nil)
			c.Abort()
			return
		}

		c.Set("githubData", githubData)
		c.Set("githubUserHas", has)

		utils.RemoveCookie(c, "githubToken")

		c.Next()
	}
}
