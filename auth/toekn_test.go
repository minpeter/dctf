package auth_test

import (
	"testing"

	"github.com/minpeter/rctf-backend/auth"
)

func TestTokenRoundtrip(t *testing.T) {
	dataToEncrypt := "Hello, this is some sensitive data!"

	// Generate a token
	token, err := auth.GetToken(dataToEncrypt)
	if err != nil {
		t.Fatalf("Error generating token: %v", err)
	}

	// Decrypt the token
	decryptedData, err := auth.GetData(token)
	if err != nil {
		t.Fatalf("Error getting data from token: %v", err)
	}

	if decryptedData != dataToEncrypt {
		t.Errorf("Decrypted data doesn't match original data. Got: %s, Expected: %s", decryptedData, dataToEncrypt)
	}
}
