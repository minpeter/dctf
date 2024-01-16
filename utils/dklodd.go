package utils

import (
	"bytes"
	"context"
	"crypto/sha1"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"text/template"
	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/gin-gonic/gin"
)

type Challenge struct {
	Image   string
	Name    string
	Id      string
	Message string
	Type    string
	Env     []string
}

var Tq *TimedQueue
var OnlineSandboxIds []string

func GetOnlineSandbox() []Challenge {

	cli, err := client.NewClientWithOpts()
	if err != nil {
		panic(err)
	}

	var resp []Challenge
	for i, onlineSandboxId := range OnlineSandboxIds {
		data, err := cli.ContainerInspect(context.Background(), onlineSandboxId)
		if err != nil {
			fmt.Println("Failed to inspect container:", err) // 에러 메시지 출력
			OnlineSandboxIds = append(OnlineSandboxIds[:i], OnlineSandboxIds[i+1:]...)
			continue
		}

		resp = append(resp, Challenge{
			Id:      data.ID[0:12],
			Name:    data.Config.Image,
			Message: data.State.Status,
		})
	}
	return resp
}

func ResetSandbox() {
	cli, err := client.NewClientWithOpts()
	if err != nil {
		panic(err)
	}
	ctx := context.Background()

	for _, onlineSandboxId := range OnlineSandboxIds {
		if err := cli.ContainerStop(ctx, onlineSandboxId, container.StopOptions{}); err != nil {
			fmt.Println("Failed to stop container:", err) // 에러 메시지 출력
			continue
		}

		if err := cli.ContainerRemove(ctx, onlineSandboxId, types.ContainerRemoveOptions{
			RemoveVolumes: true,
			Force:         true,
		}); err != nil {
			fmt.Println("Failed to remove container:", err) // 에러 메시지 출력
			continue
		}
	}

	OnlineSandboxIds = nil

}

func LoadOnlineSandbox() {
	cli, err := client.NewClientWithOpts()
	if err != nil {
		panic(err)
	}
	ctx := context.Background()

	containers, err := cli.ContainerList(ctx, types.ContainerListOptions{})
	if err != nil {
		panic(err)
	}

	for _, instance := range containers {
		if instance.Labels["dynamic"] == "true" {
			OnlineSandboxIds = append(OnlineSandboxIds, instance.ID[0:12])
		}
	}
}

func CRLogin() (string, error) {
	ctx := context.Background()
	cli, err := client.NewClientWithOpts()
	if err != nil {
		panic(err)
	}

	authConfig := types.AuthConfig{
		Username:      os.Getenv("CR_USERNAME"),
		Password:      os.Getenv("CR_PASSWORD"),
		ServerAddress: "https://ghcr.io",
	}

	if os.Getenv("CR_USERNAME") == "" || os.Getenv("CR_PASSWORD") == "" {
		return "public image maybe?", nil
	}

	_, err = cli.RegistryLogin(ctx, authConfig)
	if err != nil {
		return "", err
	}

	encodedJSON, err := json.Marshal(authConfig)
	if err != nil {
		return "", err
	}
	authStr := base64.URLEncoding.EncodeToString(encodedJSON)

	return authStr, nil
}

func PullImage(imageName string) {
	ctx := context.Background()
	cli, err := client.NewClientWithOpts()
	if err != nil {
		panic(err)
	}

	fmt.Println("create sandbox: " + imageName)

	authStr, err := CRLogin()
	if err != nil {
		panic(err)
	}

	if authStr == "public image maybe?" {
		fmt.Println("public image maybe?")
		authStr = ""
	}

	_, _, err = cli.ImageInspectWithRaw(ctx, imageName)
	if err != nil {
		fmt.Println("pull image: " + imageName)
		out, err := cli.ImagePull(ctx, imageName, types.ImagePullOptions{
			RegistryAuth: authStr,
		})
		if err != nil {
			panic(err)
		}

		// Wait for the image pull to complete
		var buf bytes.Buffer
		_, copyErr := io.Copy(&buf, out)
		if copyErr != nil {
			panic(copyErr)
		}

		// Check if there are any errors reported in the output
		if strings.Contains(buf.String(), "error") {
			panic("Error while pulling image: " + imageName)
		}

		// Now the image pull is complete
		fmt.Println("Image pull complete for: " + imageName)
	}
}

func GenerateId(data *gin.Context) string {
	hash := sha1.Sum([]byte(data.ClientIP() + data.Request.UserAgent() + time.Now().String()))
	return strings.ReplaceAll(strings.ToLower(base64.RawURLEncoding.EncodeToString(hash[:])[:5]), "_", "0")
}

func GetAllChall() ([]Challenge, error) {
	fileContent, err := os.ReadFile("challenges.json")
	if err != nil {
		return nil, err
	}

	// Unmarshal JSON content into an array of Challenge structs
	var challenges []Challenge
	err = json.Unmarshal(fileContent, &challenges)
	if err != nil {
		return nil, err
	}

	var ChallengeId int
	for i := 0; i < len(challenges); i++ {
		ChallengeId = i
		challenges[i].Id = strconv.Itoa(ChallengeId)
	}

	return challenges, nil
}

func AddChall(chall Challenge) {
	challenges, err := GetAllChall()
	if err != nil {
		panic(err)
	}

	challenges = append(challenges, chall)

	challengesJson, err := json.Marshal(challenges)
	if err != nil {
		panic(err)
	}

	err = os.WriteFile("challenges.json", challengesJson, 0644)
	if err != nil {
		panic(err)
	}
}

func RemoveSandbox(sandboxId string) string {
	cli, err := client.NewClientWithOpts()
	if err != nil {
		panic(err)
	}
	ctx := context.Background()

	for _, onlineSandboxId := range OnlineSandboxIds {
		if onlineSandboxId == sandboxId {
			if err := cli.ContainerStop(ctx, sandboxId, container.StopOptions{}); err != nil {
				return "docker client error - 3: failed to stop container"

			}

			if err := cli.ContainerRemove(ctx, sandboxId, types.ContainerRemoveOptions{
				RemoveVolumes: true,
				Force:         true,
			}); err != nil {
				return "docker client error - 4: failed to remove container"

			}

			for i, onlineSandboxId := range OnlineSandboxIds {
				if onlineSandboxId == sandboxId {
					OnlineSandboxIds = append(OnlineSandboxIds[:i], OnlineSandboxIds[i+1:]...)
				}
			}

			return "successfully removed sandbox"

		}

	}

	return "sandbox not found"
}

func RemoveChall(challName string) {
	challenges, err := GetAllChall()
	if err != nil {
		panic(err)
	}

	for i := 0; i < len(challenges); i++ {
		if challenges[i].Name == challName {
			challenges = append(challenges[:i], challenges[i+1:]...)
		}
	}

	challengesJson, err := json.Marshal(challenges)
	if err != nil {
		panic(err)
	}

	err = os.WriteFile("challenges.json", challengesJson, 0644)
	if err != nil {
		panic(err)
	}
}

func GetChallbyId(id string) Challenge {
	chall, err := GetAllChall()
	if err != nil {
		panic(err)
	}
	numberId, _ := strconv.Atoi(id)
	return chall[numberId]
}

func RenderTemplates(c *gin.Context, Data any, optionTemplateName ...string) {

	mainTemplateName := "main"

	if c.GetHeader("Hx-Request") == "true" {
		mainTemplateName = "htmx"
	}

	var templateName string

	if len(optionTemplateName) == 0 {
		templateName = c.Request.URL.Path

		if templateName == "/" {
			templateName = "main"
		}
	} else {
		templateName = optionTemplateName[0]
	}

	// 메인 템플릿 디렉토리
	mainTemplateDir := "templates/layouts/"

	// 템플릿 생성
	tmpl, err := template.New(mainTemplateName).ParseGlob(filepath.Join(mainTemplateDir, "*.tmpl"))
	if err != nil {
		return
	}

	// 서브 템플릿 등록
	subTemplatePath := filepath.Join("templates/pages/", templateName+".tmpl")
	_, err = tmpl.ParseFiles(subTemplatePath)
	if err != nil {
		return
	}

	// 렌더링 결과를 저장할 버퍼 생성
	var result bytes.Buffer

	// 템플릿 실행 및 결과를 버퍼에 쓰기
	err = tmpl.ExecuteTemplate(&result, mainTemplateName+".tmpl", Data)
	if err != nil {
		return
	}

	c.Data(http.StatusOK, "text/html; charset=utf-8", result.Bytes())
}
