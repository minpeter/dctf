package auth

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/rctf-backend/auth"
	"github.com/minpeter/rctf-backend/database"
	"github.com/minpeter/rctf-backend/utils"
)

func Routes(authRoutes *gin.RouterGroup) {

	authRoutes.POST("/login", loginHandler)
	authRoutes.POST("/recover", recoverHandler)
	authRoutes.POST("/register", registerHandler)
	authRoutes.GET("/test", testHandler)
	authRoutes.POST("/verify", verifyHandler)

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

	githubToken, err := auth.GetData(auth.GithubAuth, auth.Token(req.GithubToken))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("github ID:", githubToken.GithubAuth.GithubID)
	fmt.Println("github Data:", githubToken.GithubAuth.GithubData)

	user, has, err := database.GetUserById(githubToken.GithubAuth.GithubID)

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

func recoverHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
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

	githubToken, err := auth.GetData(auth.GithubAuth, auth.Token(req.GithubToken))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	authToken, err := auth.UserRegister("ab", "test@test.com", githubToken.GithubAuth.GithubData, githubToken.GithubAuth.GithubID, githubToken.GithubAuth.GithubData)

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

func verifyHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}
