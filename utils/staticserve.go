package utils

import (
	"os"

	"github.com/gin-gonic/gin"
)

func StaticWeb(c *gin.Context) {
	FilePath := "ui/out"
	path := c.Request.URL.Path

	filePaths := []string{
		FilePath + path,
		FilePath + path + ".html",
		FilePath + path[:len(path)-1] + ".html",
	}

	for _, filePath := range filePaths {
		if fileInfo, err := os.Stat(filePath); err == nil && !fileInfo.IsDir() {
			c.File(filePath)
			return
		}
	}

	if path == "/" {
		c.File(FilePath + "/index.html")
		return
	}

	c.File(FilePath + "/404.html")
}
