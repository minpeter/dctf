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

	P := os.Getenv("PORT")
	GCI := os.Getenv("GITHUB_CLIENT_ID") != ""
	GCS := os.Getenv("GITHUB_CLIENT_SECRET") != ""
	ISDEV := os.Getenv("IS_DEVELOPMENT") == "true"

	if !ISDEV {
		fmt.Println("\n\n======== PRODUCTION MODE ========")
		gin.SetMode(gin.ReleaseMode)
	}

	fmt.Println("\n===== ENVIRONMENT VARIABLES =====")
	fmt.Printf("PORT: port to run the server on (optional, default 4000) %s\n", P)
	fmt.Printf("IS_DEVELOPMENT: development mode (optional, default false) %v\n", ISDEV)
	fmt.Printf("GITHUB_CLIENT_ID: GitHub OAuth client ID (required) %v\n", GCI)
	fmt.Printf("GITHUB_CLIENT_SECRET: GitHub OAuth client secret (required) %v\n", GCS)

	if err := database.ConnectDatabase(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	app := api.NewRouter()
	app.NoRoute(utils.StaticWeb)

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
