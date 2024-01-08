package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/telos/auth"
	"github.com/minpeter/telos/database"
	"github.com/minpeter/telos/oauth"
	"github.com/minpeter/telos/utils"
)

func Routes(authRoutes *gin.RouterGroup) {

	authRoutes.POST("/logout", logoutHandler)
	authRoutes.GET("/callback/github", GithubCallbackHandler)
	authRoutes.GET("/login/github", GithubLoginHandler)
	authRoutes.POST("/login/check", auth.AuthTokenMiddleware(), loginCheckHandler)

}

func loginCheckHandler(c *gin.Context) {
	utils.SendResponse(c, "goodUserCheck", nil)

}

func logoutHandler(c *gin.Context) {
	utils.RemoveCookie(c, "authToken")
	utils.SendResponse(c, "goodLogout", gin.H{})
}

func GithubLoginHandler(c *gin.Context) {

	url := oauth.GitHubLoginConfig.AuthCodeURL("randomstate")

	// c.Redirect(http.StatusTemporaryRedirect, url)
	c.JSON(http.StatusOK, gin.H{"url": url})
}

func GithubCallbackHandler(c *gin.Context) {
	state := c.Query("state")
	if state != "randomstate" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "state is not valid"})
		return
	}

	code := c.Query("code")

	fmt.Println("state: ", state)
	fmt.Println("code: ", code)

	githubcon := oauth.GithubConfig()

	token, err := githubcon.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create an HTTP client
	client := &http.Client{}
	req, err := http.NewRequest("GET", "https://api.github.com/user", nil)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	req.Header.Set("Authorization", "token "+token.AccessToken)
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var result GithubUserResponse
	if err := json.Unmarshal(body, &result); err != nil { // Parse []byte to go struct pointer
		fmt.Println("Error parsing response:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	user, has, err := database.GetuserByGithubId(result.ID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if !has {
		register(result, c)
		return
	}

	login(user, c)

	c.Redirect(http.StatusTemporaryRedirect, "/success")

}

func register(result GithubUserResponse, c *gin.Context) {
	authToken, err := auth.UserRegister("open", result.Email, result.Login, result.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	utils.SetCookie(c, "authToken", string(authToken))

	// utils.SendResponse(c, "goodLogin", gin.H{
	// 	"authToken": authToken,
	// })

	fmt.Println("register")
}

func login(user database.User, c *gin.Context) {
	authToken, err := auth.GetToken(user.Id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	utils.SetCookie(c, "authToken", string(authToken))

	// utils.SendResponse(c, "goodLogin", gin.H{
	// 	"authToken": authToken,
	// })

	fmt.Println("login")

}

type GithubUserResponse struct {
	Login                   string `json:"login"`
	ID                      int    `json:"id"`
	AvatarURL               string `json:"avatar_url"`
	URL                     string `json:"url"`
	Name                    string `json:"name"`
	Blog                    string `json:"blog"`
	Location                string `json:"location"`
	Email                   string `json:"email"`
	Hireable                bool   `json:"hireable"`
	Bio                     string `json:"bio"`
	TwoFactorAuthentication bool   `json:"two_factor_authentication"`
}
