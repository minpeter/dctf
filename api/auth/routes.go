package auth

import (
	"net/http"
	"regexp"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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

	utils.SendResponse(c, "goodLogin", gin.H{
		"authToken": "testAuthToken",
	})
}

func recoverHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func registerHandler(c *gin.Context) {
	// Extract request data
	var req struct {
		Email string `json:"email"`
		Name  string `json:"name"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate request data
	if req.Email == "" || req.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing email or name"})
		return
	}

	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	if !emailRegex.MatchString(req.Email) {
		utils.SendResponse(c, "badEmail", nil)
		return
	}

	nameRegex := regexp.MustCompile(`^[a-zA-Z0-9_-]{2,64}$`)
	if !nameRegex.MatchString(req.Name) {
		utils.SendResponse(c, "badName", nil)
		return
	}

	user, err := database.GetUserByNameOrEmail(req.Name, req.Email)
	if err != nil {
		if user.Email == req.Email {
			utils.SendResponse(c, "badEmail", nil)
			return
		}
		utils.SendResponse(c, "badName", nil)
		return
	}

	userUuid := uuid.New().String()

	err = database.MakeUser(userUuid, req.Name, req.Email, "open", "", 0)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	token, err := auth.GetToken(userUuid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	utils.SendResponse(c, "goodRegister", gin.H{
		"authToken": token,
	})
}

func testHandler(c *gin.Context) {
	utils.SendResponse(c, "goodTest", gin.H{})
}

func verifyHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}
