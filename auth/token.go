package auth

import (
	"encoding/base64"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt"
)

var secretKey = []byte("your-secret-key")

func GetToken(uuid string) (string, error) {
	// 만료 1시간
	expirationTime := time.Now().Add(1 * time.Hour)

	claims := jwt.MapClaims{
		"uuid": uuid,
		"exp":  expirationTime.Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	fmt.Println("token:", token)
	signedToken, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	encodedToken := base64.StdEncoding.EncodeToString([]byte(signedToken))

	return encodedToken, nil
}

func GetData(encodedToken string) (string, error) {
	decodedToken, err := base64.StdEncoding.DecodeString(encodedToken)
	if err != nil {
		return "", err
	}

	claims := jwt.MapClaims{
		"uuid": "",
		"exp":  0,
	}

	token, err := jwt.ParseWithClaims(string(decodedToken), claims, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	if err != nil {
		return "", err
	}

	// 토큰이 유효한지 검사합니다.
	if !token.Valid {
		return "", fmt.Errorf("invalid token")
	}

	// 토큰이 만료되었는지 검사합니다.
	if claims["exp"].(float64) < float64(time.Now().Unix()) {
		return "", fmt.Errorf("expired token")
	}

	return claims["uuid"].(string), nil
}
