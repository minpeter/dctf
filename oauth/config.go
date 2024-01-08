package oauth

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
)

var GitHubLoginConfig oauth2.Config

func GithubConfig() oauth2.Config {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Some error occured. Err: %s", err)
	}

	GitHubLoginConfig = oauth2.Config{
		RedirectURL:  "http://localhost:4000/api/auth/callback/github",
		ClientID:     os.Getenv("GITHUB_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		Scopes:       []string{"user"},
		Endpoint:     github.Endpoint,
	}

	return GitHubLoginConfig
}
