package integrations

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/rctf-backend/utils"
)

func Routes(integrationRoutes *gin.RouterGroup) {

	client := integrationRoutes.Group("/client")
	{
		client.GET("/config", clientConfigHandler)
	}

	ctftime := integrationRoutes.Group("/ctftime")
	{
		ctftime.POST("/callback", ctftimeCallbackHandler)
		ctftime.GET("/leaderboard", ctftimeLeaderboardHandler)
	}

}

func clientConfigHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func ctftimeCallbackHandler(c *gin.Context) {

	code := c.Query("ctftimeCode")

	
	githubcon := config.GithubConfig()

	token, err := githubcon.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create an HTTP client
	client := &http.Client{}

	// Create a request
	url := "https://api.github.com/user"
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		os.Exit(1)
	}

	// Set the Authorization header with the access token
	req.Header.Set("Authorization", "token "+token.AccessToken)

	// Make the request
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error making request:", err)
		os.Exit(1)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body) // response body is []byte

	var result GithubUserResponse
	if err := json.Unmarshal(body, &result); err != nil { // Parse []byte to go struct pointer
		fmt.Println("Can not unmarshal JSON")
	}

	has, err := database.IsExistUserByName(result.Login)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if has {

		user, err := database.GetUserByName(result.Login)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// 쿠키 셋
		c.SetCookie("token", user.NewToken(), 3600, "/", "localhost", false, true)
		c.Redirect(http.StatusTemporaryRedirect, "/user")
		return
	}

	database.AddUser(&database.User{
		Name:  result.Login,
		Email: result.Email,
	})

	user, err := database.GetUserByName(result.Login)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.SetCookie("token", user.NewToken(), 3600, "/", "localhost", false, true)
	
	})
}

func ctftimeLeaderboardHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}
