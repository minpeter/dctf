package integrations

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/minpeter/rctf-backend/auth"
	"github.com/minpeter/rctf-backend/utils"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
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

var userEndpoint = "https://api.github.com/user"

func ctftimeCallbackHandler(c *gin.Context) {

	var reqCode struct {
		Code string `json:"ctftimeCode"`
	}

	if err := c.BindJSON(&reqCode); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Println("code:", reqCode.Code)

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Some error occured. Err: %s", err)
	}

	githubcon := oauth2.Config{
		ClientID:     os.Getenv("GITHUB_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		Scopes:       []string{"user"},
		Endpoint:     github.Endpoint,
	}

	token, err := githubcon.Exchange(context.Background(), reqCode.Code)
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

	fmt.Printf("name: %s\n", result.Name)
	fmt.Printf("email: %s\n", result.Email)
	fmt.Printf("githubId: %d\n", result.ID)
	fmt.Printf("githubUsername: %s\n", result.Login)

	GithubToken, err := auth.GetToken(auth.IonAuth, auth.TokenDataTypes{
		IonAuth: auth.IonAuthTokenData{
			IonID:   result.Login,
			IonData: result.Name,
		},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	utils.SendResponse(c, "goodCtftimeToken", gin.H{
		"ctftimeToken": GithubToken,
		"ctftimeId":    result.ID,
	})
}

func ctftimeLeaderboardHandler(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

type GithubUserResponse struct {
	Login                   string    `json:"login"`
	ID                      int       `json:"id"`
	NodeID                  string    `json:"node_id"`
	AvatarURL               string    `json:"avatar_url"`
	GravatarID              string    `json:"gravatar_id"`
	URL                     string    `json:"url"`
	HTMLURL                 string    `json:"html_url"`
	FollowersURL            string    `json:"followers_url"`
	FollowingURL            string    `json:"following_url"`
	GistsURL                string    `json:"gists_url"`
	StarredURL              string    `json:"starred_url"`
	SubscriptionsURL        string    `json:"subscriptions_url"`
	OrganizationsURL        string    `json:"organizations_url"`
	ReposURL                string    `json:"repos_url"`
	EventsURL               string    `json:"events_url"`
	ReceivedEventsURL       string    `json:"received_events_url"`
	Type                    string    `json:"type"`
	SiteAdmin               bool      `json:"site_admin"`
	Name                    string    `json:"name"`
	Company                 string    `json:"company"`
	Blog                    string    `json:"blog"`
	Location                string    `json:"location"`
	Email                   string    `json:"email"`
	Hireable                bool      `json:"hireable"`
	Bio                     string    `json:"bio"`
	TwitterUsername         any       `json:"twitter_username"`
	PublicRepos             int       `json:"public_repos"`
	PublicGists             int       `json:"public_gists"`
	Followers               int       `json:"followers"`
	Following               int       `json:"following"`
	CreatedAt               time.Time `json:"created_at"`
	UpdatedAt               time.Time `json:"updated_at"`
	PrivateGists            int       `json:"private_gists"`
	TotalPrivateRepos       int       `json:"total_private_repos"`
	OwnedPrivateRepos       int       `json:"owned_private_repos"`
	DiskUsage               int       `json:"disk_usage"`
	Collaborators           int       `json:"collaborators"`
	TwoFactorAuthentication bool      `json:"two_factor_authentication"`
	Plan                    struct {
		Name          string `json:"name"`
		Space         int    `json:"space"`
		Collaborators int    `json:"collaborators"`
		PrivateRepos  int    `json:"private_repos"`
	} `json:"plan"`
}
