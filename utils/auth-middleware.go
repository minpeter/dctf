package utils

import (
	"github.com/gin-gonic/gin"
	"github.com/minpeter/rctf-backend/auth"
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
		uuid, err := auth.GetData(authHeader[7:])
		if err != nil {
			// utils.SendResponse
			SendResponse(c, "badToken", nil)
			return
		}

		// fmt.Println("token:", token)

		data, err := auth.GetData(token)
		if err != nil {
			// utils.SendResponse
			SendResponse(c, "badToken", nil)
			c.Abort()
			return
		}

		// fmt.Println("data:", data)

		c.Set("user", data)
		c.Next()
	}
}
