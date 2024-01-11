package main

import (
	"fmt"
	"log"
	"os"
	"runtime"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/minpeter/telos/api"
	"github.com/minpeter/telos/auth/oauth"
	"github.com/minpeter/telos/database"
	"github.com/minpeter/telos/utils"
)

func main() {

	utils.Tq = utils.NewTimedQueue(10)

	// utils.LoadOnlineSandbox()

	// if _, err := utils.CRLogin(); err != nil {
	// 	fmt.Println("CR Login Error: ", err)

	// 	fmt.Println("plz provide your own credentials CR_USERNAME and CR_PASSWORD")
	// }

	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("missing .env file")
		fmt.Println("using environment variables")
	}

	oauth.GithubConfig()

	fmt.Println("\n\n===== ENVIRONMENT VARIABLES =====")
	fmt.Println("PORT: port to run the server on (optional, default 4000)")
	fmt.Println("OAUTH_REDIRECT_URL: OAuth redirect URL (required, default http://localhost:4000)")
	fmt.Println("GITHUB_CLIENT_ID: GitHub OAuth client ID (required)")
	fmt.Printf("GITHUB_CLIENT_SECRET: GitHub OAuth client secret (required)\n\n")

	if err := database.ConnectDatabase(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	app := api.NewRouter()

	app.GET("/robots.txt", func(c *gin.Context) {
		c.Data(200, "text/plain", []byte("User-agent: *\nDisallow: /"))
	})

	HtmxRoute(app)

	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}

	host := ":" + port
	// Removes the “accept incoming network connections?” pop-up on macOS.
	if runtime.GOOS == "darwin" {
		host = "localhost:" + port
	}

	if err := app.Run(host); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
