package oauth

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"time"

	"github.com/google/uuid"
)

func GithubDialogUrl() (string, error) {
	key := uuid.New().String()[0:18]

	OauthStateCache.Add(string(key), 10*time.Minute, key)

	url := GitHubLoginConfig.AuthCodeURL(key)

	fmt.Println(url)

	return url, nil
}

func GithubCallback(state string, code string) (GithubUserResponse, error) {
	if !OauthStateCache.Exists(state) {
		return GithubUserResponse{}, errors.New("invalid oauth state")
	}

	githubcon := GithubConfig()

	token, err := githubcon.Exchange(context.Background(), code)
	if err != nil {
		return GithubUserResponse{}, err
	}

	client := githubcon.Client(context.Background(), token)

	resp, err := client.Get("https://api.github.com/user")
	if err != nil {
		return GithubUserResponse{}, err
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return GithubUserResponse{}, err
	}

	var result GithubUserResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return GithubUserResponse{}, err
	}

	return result, nil
}

type GithubUserResponse struct {
	Login                   string `json:"login"`
	ID                      int    `json:"id"`
	AvatarURL               string `json:"avatar_url"`
	URL                     string `json:"url"`
	Name                    string `json:"name"`
	Blog                    string `json:"blog"`
	Location                string `json:"location"`
	Email                   string `json:"email"`
	Hireable                bool   `json:"hireable"`
	Bio                     string `json:"bio"`
	TwoFactorAuthentication bool   `json:"two_factor_authentication"`
}
