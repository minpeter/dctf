package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/minpeter/telos-backend/auth"
	"github.com/minpeter/telos-backend/utils"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
)

func GithubCallbackHandler(c *gin.Context) {

	var reqCode struct {
		Code string `json:"githubCode"`
	}

	if err := c.BindJSON(&reqCode); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
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
	body, err := ioutil.ReadAll(resp.Body)

	var result GithubUserResponse
	if err := json.Unmarshal(body, &result); err != nil { // Parse []byte to go struct pointer
		fmt.Println("Error parsing response:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	GithubToken, err := auth.GetToken(auth.Github, auth.TokenDataTypes{
		Github: auth.GithubTokenData{
			GithubID:    result.Login,
			GithubEmail: result.Email,
			GithubName:  result.Name,
		},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	utils.SendResponse(c, "goodGithubToken", gin.H{
		"githubToken": GithubToken,
	})

	utils.SetCookie(c, "githubToken", string(GithubToken))

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
