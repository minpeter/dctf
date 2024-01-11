package utils

import (
	"bytes"
	"errors"
	"net/http"
	"path/filepath"
	"text/template"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/telos/templates/bases"
	"github.com/minpeter/telos/templates/layouts"
)

func ErrorRander(c *gin.Context, err error) {
	Render(c, bases.Data{
		Error: err,
	})
}

var CommonHeader = []layouts.Header{
	{
		Title: "Home",
		Url:   "/",
	},
	{
		Title: "Scoreboard",
		Url:   "/scoreboard",
	},
}

var LogoutHeader = []layouts.Header{
	{
		Title: "Login",
		Url:   "/login",
	},
}

var LoginHeader = []layouts.Header{
	{
		Title: "Challenge",
		Url:   "/challenge",
	},
	{
		Title: "Profile",
		Url:   "/profile",
	},
	{
		Title: "Logout",
		Url:   "/logout",
	},
}
var AdminHeader = []layouts.Header{
	{
		Title: "Admin",
		Url:   "/admin",
	},
}

var LogoutStateHeader = append(CommonHeader, LogoutHeader...)
var LoginStateHeader = append(CommonHeader, LoginHeader...)
var AdminStateHeader = append(CommonHeader, AdminHeader...)

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

	if Data.Header == nil {
		_, err = c.Cookie("authToken")
		if err != nil {
			Data.Header = LogoutStateHeader
		} else {
			Data.Header = LoginStateHeader
		}
	}

	if c.GetHeader("Hx-Request") == "true" && Data.Header == nil {
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
	if Data.Error != nil {
		templateName = "error"
	}
	if Data.Page != "" {
		templateName = Data.Page
	}

	_, err = tmpl.ParseFiles(filepath.Join("templates/pages/", templateName+".tmpl"))
	if err != nil {
		templateName = "error"

		_, err = tmpl.ParseFiles(filepath.Join("templates/pages/", templateName+".tmpl"))
		if err != nil {
			return
		}

		Data.Error = errors.New("404 Not Found")
	}

	var result bytes.Buffer
	err = tmpl.ExecuteTemplate(&result, mainTemplateName+".tmpl", Data)
	if err != nil {
		return
	}
	c.Data(http.StatusOK, "text/html; charset=utf-8", result.Bytes())
}
