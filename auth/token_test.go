package auth_test

import (
	"fmt"
	"reflect"
	"testing"

	"github.com/minpeter/telos-backend/auth"
)

func TestAuthToken(t *testing.T) {
	data := auth.TokenDataTypes{
		Auth: auth.AuthTokenData("sample-auth-data"),
	}

	// Generate Auth token
	authToken, err := auth.GetToken(auth.Auth, data)
	if err != nil {
		t.Fatalf("Error generating Auth token: %v", err)
	}

	fmt.Println("authToken:", authToken)

	// Verify the generated token
	retrievedData, err := auth.GetData(auth.Auth, authToken)
	if err != nil {
		t.Fatalf("Error verifying Auth token: %v", err)
	}

	fmt.Println("originalData:", data)

	fmt.Println("retrievedData:", retrievedData)

	// Check if the retrieved data matches the original data
	if !reflect.DeepEqual(data, retrievedData) {
		t.Errorf("Mismatch in token data. Expected: %v, Got: %v", data, retrievedData)
	}
}

func TestGithubAuthToken(t *testing.T) {

	data := auth.TokenDataTypes{
		GithubAuth: auth.GithubAuthTokenData{
			GithubID:           "sample-id",
			GithubPrimaryEmail: "sample-email",
			GithubName:         "sample-name",
		},
	}

	// Generate Auth token
	authToken, err := auth.GetToken(auth.GithubAuth, data)
	if err != nil {
		t.Fatalf("Error generating Auth token: %v", err)
	}

	fmt.Println("authToken:", authToken)

	// Verify the generated token
	retrievedData, err := auth.GetData(auth.GithubAuth, authToken)
	if err != nil {
		t.Fatalf("Error verifying Auth token: %v", err)
	}

	fmt.Println("originalData:", data.GithubAuth.GithubPrimaryEmail)

	fmt.Println("retrievedData:", retrievedData.GithubAuth.GithubPrimaryEmail)

	// Check if the retrieved data matches the original data
	if !reflect.DeepEqual(data, retrievedData) {
		t.Errorf("Mismatch in token data. Expected: %v, Got: %v", data, retrievedData)
	}
}
