package oauth

import (
	"os"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"

	"github.com/muesli/cache2go"
)

var GitHubLoginConfig oauth2.Config
var OauthStateCache = cache2go.Cache("oauthState")

func GithubConfig() oauth2.Config {

	GitHubLoginConfig = oauth2.Config{
		RedirectURL:  "http://localhost:4000/api/auth/callback/github",
		ClientID:     os.Getenv("GITHUB_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		Scopes:       []string{"user"},
		Endpoint:     github.Endpoint,
	}

	return GitHubLoginConfig
}
