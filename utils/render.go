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

	layout := "logout"

	if count%3 == 0 {
		layout = "login"
	} else if count%3 == 1 {
		layout = "admin"
	}

	templateName := c.Request.URL.Path

	if templateName == "/" {
		templateName = "home"
	}

	// 템플릿 생성
	tmpl, err := template.New(mainTemplateName).ParseGlob(filepath.Join("templates/bases/", "*.tmpl"))
	if err != nil {
		return
	}

	layoutTemplatePath := filepath.Join("templates/layouts/", layout+".tmpl")
	_, err = tmpl.ParseFiles(layoutTemplatePath)
	if err != nil {
		return
	}

	// 서브 템플릿 등록
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
