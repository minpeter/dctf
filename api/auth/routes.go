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

	authRoutes.POST("/login/github", GithubLoginHandler)
	authRoutes.POST("/callback/github", GithubCallbackHandler)

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

	utils.SendResponse(c, "goodGithubUrl", gin.H{"url": url})
}

func GithubCallbackHandler(c *gin.Context) {
	var request struct {
		State string `json:"state"`
		Code  string `json:"code"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if request.State == "" || request.Code == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "State or code is missing."})
		return
	}

	result, requester, err := oauth.GithubCallback(request.State, request.Code)
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

	utils.SendResponse(
		c,
		"goodAuth",
		gin.H{
			"authToken": authToken,
			"requester": requester,
		},
	)

}
