package auth

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/dctf-backend/auth"
	"github.com/minpeter/dctf-backend/database"
	"github.com/minpeter/dctf-backend/utils"
)

func Routes(authRoutes *gin.RouterGroup) {

	authRoutes.POST("/login", loginHandler)
	authRoutes.POST("/register", registerHandler)
	authRoutes.GET("/test", testHandler)

}

func loginHandler(c *gin.Context) {
	// githubToken body에서 읽어오기
	var req struct {
		GithubToken string `json:"githubToken"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// githubToken이 없으면 에러
	if req.GithubToken == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing githubToken"})
		return
	}

	githubTokenData, err := auth.GetData(auth.GithubAuth, auth.Token(req.GithubToken))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("github ID:", githubTokenData.GithubAuth.GithubID)
	fmt.Println("github email:", githubTokenData.GithubAuth.GithubPrimaryEmail)

	user, has, err := database.GetuserByGithubId(githubTokenData.GithubAuth.GithubID)

	fmt.Println("user:", user)
	fmt.Println("has:", has)
	fmt.Println("err:", err)

	if err != nil {
		// utils.SendResponse
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if !has {
		utils.SendResponse(c, "badUnknownUser", gin.H{})
		return
	}

	token, err := auth.GetToken(auth.Auth, auth.TokenDataTypes{
		Auth: auth.AuthTokenData(user.Id),
	},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	utils.SendResponse(c, "goodLogin", gin.H{
		"authToken": token,
	})

}

func registerHandler(c *gin.Context) {

	var req struct {
		GithubToken string `json:"githubToken"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// githubToken이 없으면 에러
	if req.GithubToken == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing githubToken"})
		return
	}

	githubTokenData, err := auth.GetData(auth.GithubAuth, auth.Token(req.GithubToken))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, has, err := database.GetuserByGithubId(githubTokenData.GithubAuth.GithubID)

	fmt.Println("user:", user)
	fmt.Println("has:", has)
	fmt.Println("err:", err)

	if err != nil {
		// utils.SendResponse
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if has {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user already exists"})
		return
	}

	authToken, err := auth.UserRegister("open", githubTokenData.GithubAuth.GithubPrimaryEmail, "민웅기", githubTokenData.GithubAuth.GithubID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	utils.SendResponse(c, "goodRegister", gin.H{
		"authToken": authToken,
	})
}

func testHandler(c *gin.Context) {
	utils.SendResponse(c, "goodTest", gin.H{})
}
