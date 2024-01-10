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

	var layout string
	if Data.Header == nil {
		layout = "empty"
		c.Header("HX-Retarget", "#main")
		c.Header("HX-Reswap", "outerHTML")
	} else {
		layout = "header"
	}

	templateName := c.Request.URL.Path

	if templateName == "/" {
		templateName = "home"
	}

	tmpl, err := template.New(mainTemplateName).ParseGlob(filepath.Join("templates/bases/", "*.tmpl"))
	if err != nil {
		return
	}

	layoutTemplatePath := filepath.Join("templates/layouts/", layout+".tmpl")
	_, err = tmpl.ParseFiles(layoutTemplatePath)
	if err != nil {
		return
	}

	pageWrapperTemplatePath := filepath.Join("templates/pages/", "wrapper.tmpl")
	_, err = tmpl.ParseFiles(pageWrapperTemplatePath)
	if err != nil {
		return
	}

	subTemplatePath := filepath.Join("templates/pages/", templateName+".tmpl")
	_, err = tmpl.ParseFiles(subTemplatePath)
	if err != nil {
		return
	}

	// 렌더링 결과를 저장할 버퍼 생성
	var result bytes.Buffer

	// 템플릿 실행 및 결과를 버퍼에 쓰기
	err = tmpl.ExecuteTemplate(&result, mainTemplateName+".tmpl", Data)
	if err != nil {
		return
	}

	c.Data(http.StatusOK, "text/html; charset=utf-8", result.Bytes())
}
