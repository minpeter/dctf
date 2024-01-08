package auth

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"io"
	"time"
)

type InternalTokenData struct {
	T int64
	D string
}

func TimeNow() int64 {
	return time.Now().Unix()
}

// func generateRandomKey(size int) ([]byte, error) {
// 	key := make([]byte, size)
// 	_, err := rand.Read(key)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return key, nil
// }
// var tokenKey, _ = generateRandomKey(32) // 32 bytes for AES-256

var tokenKey = []byte("aaaaabbbbbaaaaabbbbbaaaaa33aaaaa")

func encryptToken(content InternalTokenData) (string, error) {
	iv := make([]byte, 12)
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", err
	}

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

	return string(base64.StdEncoding.EncodeToString(tokenContent)), nil
}

func decryptToken(token string) (InternalTokenData, error) {
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

func GetData(token string) (string, error) {

	content, err := decryptToken(token)
	if err != nil {
		return "", err
	}

	return content.D, nil
}

func GetToken(data string) (string, error) {
	token := InternalTokenData{
		T: TimeNow(),
		D: data,
	}

	encryptedToken, err := encryptToken(token)
	if err != nil {
		return "", err
	}

	return string(encryptedToken), nil
}
