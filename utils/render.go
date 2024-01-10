package utils

import (
	"bytes"
	"net/http"
	"path/filepath"
	"text/template"

	"github.com/gin-gonic/gin"
)

var count int = 0

func RenderTemplates(c *gin.Context, Data any) {

	mainTemplateName := "root"

	if c.GetHeader("Hx-Request") == "true" {
		mainTemplateName = "htmx"
	}

	count += 1
	layout := "default"
	if count%6 == 0 {
		layout = "login"
	} else if count%6 == 2 {
		layout = "admin"
	}

	if c.GetHeader("Hx-Request") == "true" && layout == "default" {
		layout = "empty"
		c.Header("HX-Retarget", "#main")
		c.Header("HX-Reswap", "outerHTML")
	} else {
		layout = "logout"
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
