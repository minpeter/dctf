package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/telos/auth/oauth"
	"github.com/minpeter/telos/templates/bases"
	"github.com/minpeter/telos/templates/layouts"
	"github.com/minpeter/telos/utils"
)

func HtmxRoute(app *gin.Engine) {

	app.GET("/login", func(c *gin.Context) {

		url, err := oauth.GithubDialogUrl()
		if err != nil {
			utils.ErrorRander(c, err)
			return
		}

		utils.Render(c, bases.Data{
			Header: []layouts.Header{
				{
					Title: "Home",
					Url:   "/",
				},
				{
					Title: "Challenge",
					Url:   "/challenge",
				},
				{
					Title: "About",
					Url:   "/about",
				},
				{
					Title: "Login",
					Url:   "/login",
				},
			},
			Data: map[string]any{
				"GitHubLoginURL": url,
			},
		})
	})

	app.GET("/error", func(c *gin.Context) {

		utils.Render(c, bases.Data{
			Header: []layouts.Header{
				{
					Title: "Home",
					Url:   "/",
				},
				{
					Title: "Challenge",
					Url:   "/challenge",
				},
				{
					Title: "About",
					Url:   "/about",
				},
				{
					Title: "Login",
					Url:   "/login",
				},
			},
			Error: fmt.Errorf("this is an error"),
		})
	})

	app.NoRoute(func(c *gin.Context) {

		fmt.Println("NoRoute", c.Request.URL.Path)
		utils.Render(c, bases.Data{
			Header: []layouts.Header{
				{
					Title: "Home",
					Url:   "/",
				},
				{
					Title: "Challenge",
					Url:   "/challenge",
				},
				{
					Title: "About",
					Url:   "/about",
				},
				{
					Title: "Login",
					Url:   "/login",
				},
			},
		})
	})
}
