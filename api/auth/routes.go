package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/telos-backend/auth"
	"github.com/minpeter/telos-backend/database"
	"github.com/minpeter/telos-backend/utils"
)

func Routes(authRoutes *gin.RouterGroup) {

	authRoutes.POST("/logout", logoutHandler)
	authRoutes.POST("/callback/github", GithubCallbackHandler)
	authRoutes.POST("/login", auth.GithubTokenMiddleware(), loginHandler)
	authRoutes.POST("/register", auth.GithubTokenMiddleware(), registerHandler)

}

func logoutHandler(c *gin.Context) {
	utils.RemoveCookie(c, "authToken")
	utils.SendResponse(c, "goodLogout", gin.H{})
}

func loginHandler(c *gin.Context) {

	githubUserHas, has := c.Get("githubUserHas")
	if !has {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "githubUserHas not found"})
		return
	}

	if !githubUserHas.(bool) {
		utils.SendResponse(c, "badUnknownUser", gin.H{})
		return
	}

	githubData, has := c.Get("githubData")
	if !has {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "githubData not found"})
		return
	}

	githubTokenData := githubData.(auth.GithubTokenData)

	user, has, err := database.GetuserByGithubId(githubTokenData.GithubID)

	if err != nil || !has {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	authToken, err := auth.GetToken(auth.Auth, auth.TokenDataTypes{
		Auth: auth.AuthTokenData(user.Id),
	},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	utils.SetCookie(c, "authToken", string(authToken))
	utils.SendResponse(c, "goodLogin", gin.H{
		"authToken": authToken,
	})

}

func registerHandler(c *gin.Context) {

	githubUserHas, has := c.Get("githubUserHas")
	if !has {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "githubUserHas not found"})
		return
	}

	if githubUserHas.(bool) {
		utils.SendResponse(c, "badAlreadyRegistered", gin.H{})
		return
	}

	githubData, has := c.Get("githubData")
	if !has {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "githubData not found"})
		return
	}

	githubTokenData := githubData.(auth.GithubTokenData)

	authToken, err := auth.UserRegister("open", githubTokenData.GithubEmail, githubTokenData.GithubName, githubTokenData.GithubID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	utils.SetCookie(c, "authToken", string(authToken))

	utils.SendResponse(c, "goodRegister", gin.H{
		"authToken": authToken,
	})
}
