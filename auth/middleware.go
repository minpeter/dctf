package auth

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/telos/database"
	"github.com/minpeter/telos/utils"
)

func AuthTokenMiddleware(params ...int) gin.HandlerFunc {

	if len(params) == 0 {
		params = append(params, 0)
	}

	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" && authHeader[:7] != "Bearer " {
			utils.SendResponse(c, "badToken", nil)
			return
		}

		log.Printf("authHeader: %s", authHeader)
		uuid, err := GetData(authHeader[7:])
		if err != nil {
			utils.SendResponse(c, "badToken", nil)
			c.Abort()
			return
		}

		user, has, err := database.GetUserById(uuid)
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

		fmt.Println("!!MIDDLEWARE!! Auth Token: ", authHeader)
		fmt.Println("!!MIDDLEWARE!! user authenticated: ", user)

		c.Next()
	}
}
