package auth

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/telos-backend/database"
	"github.com/minpeter/telos-backend/utils"
)

func AuthTokenMiddleware(params ...int) gin.HandlerFunc {

	if len(params) == 0 {
		params = append(params, 0)
	}

	return func(c *gin.Context) {
		cookie, err := c.Cookie("authToken")
		if err != nil {
			log.Printf("cookie error: %s", err.Error())
			utils.SendResponse(c, "badToken", nil)
			c.Abort()
			return
		}

		uuid, err := GetData(Auth, Token(cookie))
		if err != nil {
			utils.SendResponse(c, "badToken", nil)
			c.Abort()
			return
		}

		user, has, err := database.GetUserById(string(uuid.Auth))
		if err != nil || !has {
			utils.SendResponse(c, "badToken", nil)
			c.Abort()
			return
		}

		if user.Perms < params[0] {
			utils.SendResponse(c, "badPerms", nil)
			c.Abort()
			return
		}

		c.Set("user", user)
		c.Set("userid", user.Id)

		fmt.Println("!!MIDDLEWARE!! cookie: ", cookie)
		fmt.Println("!!MIDDLEWARE!! user authenticated: ", user)

		c.Next()
	}
}
