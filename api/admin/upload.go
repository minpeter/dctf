package admin

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/vincent-petithory/dataurl"

	"github.com/minpeter/telos-backend/utils"
)

func uploadPostHandler(c *gin.Context) {

	var req struct {
		Files []struct {
			Name string `json:"name"`
			Data string `json:"data"`
		} `json:"files"`
	}

	var resp struct {
		Files []struct {
			Name string `json:"name"`
			Url  string `json:"url"`
		} `json:"files"`
	}

	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _, file := range req.Files {
		resp.Files = append(resp.Files, struct {
			Name string `json:"name"`
			Url  string `json:"url"`
		}{
			Name: file.Name,
			Url:  fmt.Sprintf("http://localhost:8080/api/files/%s", file.Name),
		})

		dataURL, err := dataurl.DecodeString(file.Data)
		if err != nil {
			utils.SendResponse(c, "badDataUri", gin.H{})
			return
		}

		// files folder check
		if _, err := os.Stat("files"); os.IsNotExist(err) {
			os.Mkdir("files", 0755)
		}

		err = ioutil.WriteFile(fmt.Sprintf("files/%s", file.Name), dataURL.Data, 0644)
		if err != nil {
			utils.SendResponse(c, "internalError", gin.H{})
			return
		}

		f, err := os.Create(fmt.Sprintf("files/%s", file.Name))
		if err != nil {
			utils.SendResponse(c, "internalError", gin.H{})
			return
		}

		defer f.Close()

		_, err = f.Write(dataURL.Data)

		if err != nil {
			utils.SendResponse(c, "internalError", gin.H{})
			return
		}

	}

	utils.SendResponse(c, "goodFilesUpload", resp)
}

func uploadQueryHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}
