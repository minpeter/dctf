package auth_test

import (
	"fmt"
	"reflect"
	"testing"

	"github.com/minpeter/rctf-backend/auth"
)

func TestAuthToken(t *testing.T) {
	// Create dummy data for Auth token
	authTokenData := auth.AuthTokenData("sample-auth-data")
	data := auth.TokenDataTypes{
		Auth: authTokenData,
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

func TestIonAuthToken(t *testing.T) {

	data := auth.TokenDataTypes{
		IonAuth: auth.IonAuthTokenData{
			IonID:   "sample-ion-id",
			IonData: "sample-ion-data",
		},
	}

	// Generate Auth token
	authToken, err := auth.GetToken(auth.IonAuth, data)
	if err != nil {
		t.Fatalf("Error generating Auth token: %v", err)
	}

	fmt.Println("authToken:", authToken)

	// Verify the generated token
	retrievedData, err := auth.GetData(auth.IonAuth, authToken)
	if err != nil {
		t.Fatalf("Error verifying Auth token: %v", err)
	}

	fmt.Println("originalData:", data.IonAuth.IonData)

	fmt.Println("retrievedData:", retrievedData.IonAuth.IonData)

	// Check if the retrieved data matches the original data
	if !reflect.DeepEqual(data, retrievedData) {
		t.Errorf("Mismatch in token data. Expected: %v, Got: %v", data, retrievedData)
	}
}
