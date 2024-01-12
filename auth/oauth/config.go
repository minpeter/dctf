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

	if os.Getenv("OAUTH_REDIRECT_URL") == "" {
		os.Setenv("OAUTH_REDIRECT_URL", "http://localhost:3000")
	}

	GitHubLoginConfig = oauth2.Config{
		RedirectURL:  os.Getenv("OAUTH_REDIRECT_URL") + "/login/callback/github",
		ClientID:     os.Getenv("GITHUB_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		Scopes:       []string{"read:user"},
		Endpoint:     github.Endpoint,
	}

	return GitHubLoginConfig
}
