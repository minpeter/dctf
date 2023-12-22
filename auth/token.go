package auth

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math"
	"time"
)

type TokenKinds int

const (
	Auth TokenKinds = iota
	Team
	Verify
	IonAuth
)

// VerifyTokenKinds represents verification token kinds
type VerifyTokenKinds string

const (
	Update   VerifyTokenKinds = "update"
	Register VerifyTokenKinds = "register"
	Recover  VerifyTokenKinds = "recover"
)

// AuthTokenData represents authentication token data
type AuthTokenData string

// TeamTokenData represents team token data
type TeamTokenData string

// BaseVerifyTokenData represents base verification token data
type BaseVerifyTokenData struct {
	VerifyID string
	Kind     VerifyTokenKinds
}

// RegisterVerifyTokenData represents register verification token data
type RegisterVerifyTokenData struct {
	BaseVerifyTokenData
	Email    string
	Name     string
	Division string
}

// UpdateVerifyTokenData represents update verification token data
type UpdateVerifyTokenData struct {
	BaseVerifyTokenData
	UserID   string
	Email    string
	Division string
}

// RecoverTokenData represents recover verification token data
type RecoverTokenData struct {
	BaseVerifyTokenData
	UserID string
	Email  string
}

// VerifyTokenData represents union type for verification token data
type VerifyTokenData interface {
	isVerifyTokenData()
}

// Implement isVerifyTokenData method for each struct to satisfy the interface
func (r RegisterVerifyTokenData) isVerifyTokenData() {}
func (u UpdateVerifyTokenData) isVerifyTokenData()   {}
func (r RecoverTokenData) isVerifyTokenData()        {}

// IonAuthTokenData represents ion authentication token data
type IonAuthTokenData struct {
	IonID   string
	IonData string
}

// TokenDataTypes represents internal map of token types
type TokenDataTypes struct {
	Auth    AuthTokenData
	Team    TeamTokenData
	Verify  VerifyTokenData
	IonAuth IonAuthTokenData
}

// Token represents a string token
type Token string

// InternalTokenData represents internal token data structure
type InternalTokenData struct {
	K TokenKinds
	T int64
	D TokenDataTypes
}

// TokenExpiries represents token expiration times
var TokenExpiries = map[TokenKinds]float64{
	// Inf(1) means infinite
	Auth: math.Inf(1),
	Team: math.Inf(1),
	// 1 hour
	Verify:  3600,
	IonAuth: 3600,
}

// TimeNow returns the current time in seconds since epoch
func TimeNow() int64 {
	return time.Now().Unix()
}

func generateRandomKey(size int) ([]byte, error) {
	key := make([]byte, size)
	_, err := rand.Read(key)
	if err != nil {
		return nil, err
	}
	return key, nil
}

// var tokenKey = []byte("your-secret-key")
var tokenKey, _ = generateRandomKey(32) // 32 bytes for AES-256

func encryptToken(content InternalTokenData) (Token, error) {
	iv := make([]byte, 12)
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", err
	}

	fmt.Println("iv:", iv)
	block, err := aes.NewCipher(tokenKey)
	if err != nil {
		return "", err
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	// Convert content to JSON
	contentJSON, err := json.Marshal(content)
	if err != nil {
		return "", err
	}

	cipherText := aesgcm.Seal(nil, iv, contentJSON, nil)

	// Append iv and nonce to the cipherText
	tokenContent := append(iv, cipherText...)

	return Token(base64.StdEncoding.EncodeToString(tokenContent)), nil
}
func decryptToken(token Token) (InternalTokenData, error) {
	tokenContent, err := base64.StdEncoding.DecodeString(string(token))
	if err != nil {
		return InternalTokenData{}, err
	}

	iv := tokenContent[:12]

	cipherText := tokenContent[12:]

	block, err := aes.NewCipher(tokenKey)
	if err != nil {
		return InternalTokenData{}, err
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return InternalTokenData{}, err
	}

	plainText, err := aesgcm.Open(nil, iv, cipherText, nil)
	if err != nil {
		return InternalTokenData{}, err
	}

	var decodedData InternalTokenData
	err = json.Unmarshal(plainText, &decodedData)
	if err != nil {
		return InternalTokenData{}, err
	}

	return decodedData, nil
}

func GetData(expectedTokenKind TokenKinds, token Token) (TokenDataTypes, error) {

	content, err := decryptToken(token)
	if err != nil {
		return TokenDataTypes{}, err
	}

	if content.K != expectedTokenKind {
		return TokenDataTypes{}, errors.New("unexpected token kind")
	}

	// fmt.Printf("Token Expiry: %v\n", TokenExpiries[content.K])
	// fmt.Printf("Token Time: %v\n", content.T)
	// fmt.Printf("Time Now: %v\n", TimeNow())

	if !math.IsInf(TokenExpiries[content.K], 1) && content.T+int64(TokenExpiries[content.K]) < TimeNow() {
		return TokenDataTypes{}, errors.New("Token expired")
	}

	return content.D, nil
}

func GetToken(tokenKind TokenKinds, data TokenDataTypes) (Token, error) {
	token := InternalTokenData{
		K: tokenKind,
		T: TimeNow(),
		D: data,
	}

	encryptedToken, err := encryptToken(token)
	if err != nil {
		return "", err
	}

	return Token(encryptedToken), nil
}
