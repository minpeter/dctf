package utils

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/dctf-backend/auth"
	"github.com/minpeter/dctf-backend/database"
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

		c.Set("user", user)

		fmt.Println("user authenticated")

		c.Next()
	}
}
