package utils

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/rctf-backend/auth"
	"github.com/minpeter/rctf-backend/database"
)

func TokenAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		// if (authHeader === undefined || !authHeader.startsWith('Bearer ')) {
		if authHeader == "" && authHeader[:7] != "Bearer " {
			// utils.SendResponse
			SendResponse(c, "badToken", nil)
			return
		}
		uuid, err := auth.GetData(auth.Auth, auth.Token(authHeader[7:]))
		if err != nil {
			// utils.SendResponse
			SendResponse(c, "badToken", nil)
			c.Abort()
			return
		}

		user, err := database.GetUserById(string(uuid.Auth))
		if err != nil {
			// utils.SendResponse
			SendResponse(c, "badToken", nil)
			c.Abort()
			return
		}

		c.Set("user", user)

		fmt.Println("user authenticated")

		c.Next()
	}
}
