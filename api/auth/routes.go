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
	// ctftimeToken body에서 읽어오기
	var req struct {
		CtftimeToken string `json:"ctftimeToken"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ctftimeToken이 없으면 에러
	if req.CtftimeToken == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing ctftimeToken"})
		return
	}

	ctftimeToken, err := auth.GetData(auth.GithubAuth, auth.Token(req.CtftimeToken))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("ctftime ID:", ctftimeToken.GithubAuth.GithubID)
	fmt.Println("ctftime Data:", ctftimeToken.GithubAuth.GithubData)

	user, has, err := database.GetUserById(ctftimeToken.GithubAuth.GithubID)

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
		CtftimeToken string `json:"ctftimeToken"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ctftimeToken이 없으면 에러
	if req.CtftimeToken == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing ctftimeToken"})
		return
	}

	ctftimeToken, err := auth.GetData(auth.GithubAuth, auth.Token(req.CtftimeToken))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	authToken, err := auth.UserRegister("ab", "test@test.com", ctftimeToken.GithubAuth.GithubData, ctftimeToken.GithubAuth.GithubID, ctftimeToken.GithubAuth.GithubData)

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
