package utils

import (
	"github.com/gin-gonic/gin"
)

func SetCookie(c *gin.Context, key, value string) {
	c.SetCookie(key, value, 60*60*24*30, "/", "", false, true)
}

func RemoveCookie(c *gin.Context, key string) {
	c.SetCookie(key, "", -1, "/", "", false, true)
}
