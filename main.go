package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"runtime"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hoisie/mustache"
	"github.com/joho/godotenv"
	"github.com/minpeter/dctf-backend/api"
	"github.com/minpeter/dctf-backend/database"
	"github.com/minpeter/dctf-backend/utils"
)

type clientConfig struct {
	Meta            Meta              `json:"meta"`
	HomeContent     string            `json:"homeContent"`
	Sponsors        []interface{}     `json:"sponsors"`
	GlobalSiteTag   string            `json:"globalSiteTag"`
	CtfName         string            `json:"ctfName"`
	Divisions       map[string]string `json:"divisions"`
	DefaultDivision string            `json:"defaultDivision"`
	Origin          string            `json:"origin"`
	StartTime       int64             `json:"startTime"`
	EndTime         int64             `json:"endTime"`
	EmailEnabled    bool              `json:"emailEnabled"`
	UserMembers     bool              `json:"userMembers"`
	FaviconUrl      string            `json:"faviconUrl"`
	Github          struct {
		ClientId string `json:"clientId"`
	} `json:"github"`
}

type Meta struct {
	Description string `json:"description"`
	ImageURL    string `json:"imageUrl"`
}

var ClientConfig clientConfig

func serveIndex(c *gin.Context) {

	jsonData, err := json.Marshal(ClientConfig)
	if err != nil {
		log.Fatalf("Error marshalling clientConfig: %v", err)
	}

	rendered := struct {
		JSONConfig string
		Config     clientConfig
	}{
		JSONConfig: string(jsonData),
		Config:     ClientConfig,
	}

	// Use mustache to render the index.html template
	html := mustache.RenderFile("client/dist/index.html", rendered)
	c.Writer.WriteString(html)
}

func loadClientConfig() {
	configFile, err := os.Open("client-config.json")
	if err != nil {
		fmt.Printf("Error opening client-config.json: %v\n", err)
		return
	}
	defer configFile.Close()

	decoder := json.NewDecoder(configFile)
	err = decoder.Decode(&ClientConfig)

	ClientConfig.Github.ClientId = os.Getenv("GITHUB_CLIENT_ID")

	if err != nil {
		fmt.Printf("Error decoding client-config.json: %v\n", err)
		return
	}
}

func main() {

	utils.Tq = utils.NewTimedQueue(int(1 * time.Minute))

	utils.LoadOnlineSandbox()

	if _, err := utils.CRLogin(); err != nil {
		fmt.Println("CR Login Error: ", err)

		fmt.Println("plz provide your own credentials CR_USERNAME and CR_PASSWORD")

		// os.Exit(1)
	}

	err := godotenv.Load(".env")

	fmt.Println("\n\n===== ENVIRONMENT VARIABLES =====")
	fmt.Println("PORT: port to run the server on (optional, default 4000)")
	fmt.Println("GITHUB_CLIENT_ID: GitHub OAuth client ID (required)")
	fmt.Printf("GITHUB_CLIENT_SECRET: GitHub OAuth client secret (required)\n\n")

	if err != nil {
		fmt.Println("missing .env file")
		fmt.Println("using environment variables")
	}

	if err := database.ConnectDatabase(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	loadClientConfig()

	app := api.NewRouter()

	app.GET("/", serveIndex)

	app.Static("/assets", "client/dist/assets")

	app.NoRoute(serveIndex)

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
