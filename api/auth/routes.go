package auth

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/minpeter/telos/auth"
	"github.com/minpeter/telos/auth/oauth"
	"github.com/minpeter/telos/database"
	"github.com/minpeter/telos/utils"
)

func Routes(authRoutes *gin.RouterGroup) {

	authRoutes.GET("/logout", logoutHandler)

	authRoutes.GET("/login/github", GithubLoginHandler)
	authRoutes.GET("/callback/github", GithubCallbackHandler)

	authRoutes.POST("/login/check", auth.AuthTokenMiddleware(), loginCheckHandler)

}

func loginCheckHandler(c *gin.Context) {
	utils.SendResponse(c, "goodUserCheck", nil)
}

func logoutHandler(c *gin.Context) {

	utils.RemoveCookie(c, "authToken")
	c.Redirect(http.StatusTemporaryRedirect, "/")

}

func GithubLoginHandler(c *gin.Context) {

	var Requester string

	if c.Query("redirect") != "" {
		Requester = c.Query("redirect")
	} else {
		Requester = c.Request.Header.Get("Referer")
	}

	state := uuid.New().String()[0:18]
	oauth.OauthStateCache.Add(state, 10*time.Minute, Requester)
	url := oauth.GitHubLoginConfig.AuthCodeURL(state)
	fmt.Println(url)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func GithubCallbackHandler(c *gin.Context) {
	state := c.Query("state")
	code := c.Query("code")

	result, requester, err := oauth.GithubCallback(state, code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	user, has, err := database.GetuserByGithubId(result.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var authToken string
	var authErr error

	if !has {
		authToken, authErr = auth.UserRegister("open", result.Email, result.Login, result.ID)
	} else {
		authToken, authErr = auth.GetToken(user.Id)
	}

	if authErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	utils.SetCookie(c, "authToken", authToken)
	c.Redirect(http.StatusTemporaryRedirect, requester)

}
