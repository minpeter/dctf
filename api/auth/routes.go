package auth

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/telos/auth"
	"github.com/minpeter/telos/auth/oauth"
	"github.com/minpeter/telos/database"
	"github.com/minpeter/telos/templates/bases"
	"github.com/minpeter/telos/utils"
)

func Routes(authRoutes *gin.RouterGroup) {

	authRoutes.GET("/logout", logoutHandler)
	authRoutes.GET("/callback/github", GithubCallbackHandler)
	authRoutes.GET("/login/github", GithubLoginHandler)
	authRoutes.POST("/login/check", auth.AuthTokenMiddleware(), loginCheckHandler)

}

func loginCheckHandler(c *gin.Context) {
	utils.SendResponse(c, "goodUserCheck", nil)

}

func logoutHandler(c *gin.Context) {
	utils.RemoveCookie(c, "authToken")

	c.Header("HX-Push-Url", "/home")
	utils.Render(c, bases.Data{
		Header: utils.LogoutStateHeader,
		Page:   "home",
	})

}

func GithubLoginHandler(c *gin.Context) {

	url, err := oauth.GithubDialogUrl()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Redirect(http.StatusTemporaryRedirect, url)
	c.JSON(http.StatusOK, gin.H{"url": url})

}

func GithubCallbackHandler(c *gin.Context) {
	state := c.Query("state")
	code := c.Query("code")

	result, err := oauth.GithubCallback(state, code)
	if err != nil {
		utils.ErrorRander(c, err)
		return
	}

	user, has, err := database.GetuserByGithubId(result.ID)

	if err != nil {
		utils.ErrorRander(c, err)
		return
	}

	if !has {
		register(result, c)
		return
	}

	login(user, c)
}

func register(result oauth.GithubUserResponse, c *gin.Context) {
	authToken, err := auth.UserRegister("open", result.Email, result.Login, result.ID)
	if err != nil {
		utils.ErrorRander(c, err)
		return
	}

	utils.SetCookie(c, "authToken", authToken)
	// utils.SendResponse(c, "goodLogin", gin.H{
	// 	"authToken": authToken,
	// })

	c.Redirect(http.StatusTemporaryRedirect, "/")

	fmt.Println("register")
}

func login(user database.User, c *gin.Context) {
	authToken, err := auth.GetToken(user.Id)
	if err != nil {
		utils.ErrorRander(c, err)
		return
	}

	utils.SetCookie(c, "authToken", authToken)

	c.Redirect(http.StatusTemporaryRedirect, "/")

	fmt.Println("login")

}
