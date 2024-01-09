package utils

import (
	"bytes"
	"net/http"
	"path/filepath"
	"text/template"

	"github.com/gin-gonic/gin"
)

func RenderTemplates(c *gin.Context, Data any) {

	mainTemplateName := "main"

	if c.GetHeader("Hx-Request") == "true" {
		mainTemplateName = "htmx"
	}

	templateName := c.Request.URL.Path

	if templateName == "/" {
		templateName = "home"
	}

	// 메인 템플릿 디렉토리
	mainTemplateDir := "templates/layouts/"

	// 템플릿 생성
	tmpl, err := template.New(mainTemplateName).ParseGlob(filepath.Join(mainTemplateDir, "*.tmpl"))
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
