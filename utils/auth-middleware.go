package utils

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/telos-backend/auth"
	"github.com/minpeter/telos-backend/database"
)

// options: [0] = perms
func TokenAuthMiddleware(params ...int) gin.HandlerFunc {

	if len(params) == 0 {
		params = append(params, 0)
	}

	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		// if (authHeader === undefined || !authHeader.startsWith('Bearer ')) {
		if authHeader == "" && authHeader[:7] != "Bearer " {
			// utils.SendResponse
			SendResponse(c, "badToken", nil)
			return
		}

		log.Printf("authHeader: %s", authHeader)
		uuid, err := auth.GetData(auth.Auth, auth.Token(authHeader[7:]))
		if err != nil {
			// utils.SendResponse
			SendResponse(c, "badToken", nil)
			c.Abort()
			return
		}

		user, has, err := database.GetUserById(string(uuid.Auth))
		if err != nil || !has {
			// utils.SendResponse
			SendResponse(c, "badToken", nil)
			c.Abort()
			return
		}

		if user.Perms < params[0] {
			SendResponse(c, "badPerms", nil)
			c.Abort()
			return
		}

		c.Set("user", user)
		c.Set("userid", user.Id)

		fmt.Println("user authenticated")

		fmt.Println("user:", user)

		c.Next()
	}
}
