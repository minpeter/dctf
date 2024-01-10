package utils

import (
	"bytes"
	"net/http"
	"path/filepath"
	"text/template"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/telos/templates/bases"
)

func Render(c *gin.Context, Data bases.Data) {

	mainTemplateName := "root"
	if c.GetHeader("Hx-Request") == "true" {
		mainTemplateName = "htmx"
	}

	tmpl, err := template.New(mainTemplateName).ParseGlob(filepath.Join("templates/bases/", "*.tmpl"))
	if err != nil {
		return
	}

	var layout string
	if Data.Header == nil || c.GetHeader("Hx-Request") == "true" {
		layout = "empty"
		c.Header("HX-Retarget", "#main")
		c.Header("HX-Reswap", "outerHTML")
	} else {
		layout = "layout"
	}
	_, err = tmpl.ParseFiles(filepath.Join("templates/layouts/", layout+".tmpl"))
	if err != nil {
		return
	}

	templateName := c.Request.URL.Path
	if templateName == "/" {
		templateName = "home"
	}
	_, err = tmpl.ParseFiles(filepath.Join("templates/pages/", templateName+".tmpl"))
	if err != nil {
		return
	}

	var result bytes.Buffer
	err = tmpl.ExecuteTemplate(&result, mainTemplateName+".tmpl", Data)
	if err != nil {
		return
	}
	c.Data(http.StatusOK, "text/html; charset=utf-8", result.Bytes())
}
