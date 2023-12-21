package auth

import (
	"encoding/base64"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt"
)

var secretKey = []byte("your-secret-key")

// Claims는 사용자 정의 클레임을 정의합니다.
type Claims struct {
	uuid string
	jwt.StandardClaims
}

func GetToken(uuid string) (string, error) {
	// 토큰 만료 시간을 설정합니다. 예제로 1시간으로 설정합니다.
	expirationTime := time.Now().Add(1 * time.Hour)

	// 사용자 정의 클레임을 생성합니다.
	claims := &Claims{
		uuid: uuid,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	// 토큰을 생성합니다.
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	fmt.Println("token:", token)
	// 토큰을 서명합니다.
	signedToken, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}
	// 서명 완료
	fmt.Println("signedToken:", signedToken)

	// 서명된 토큰을 Base64로 인코딩합니다.
	encodedToken := base64.StdEncoding.EncodeToString([]byte(signedToken))

	fmt.Println("encodedToken:", encodedToken)
	return encodedToken, nil
}

// GetData 함수는 주어진 Base64로 인코딩된 JWT 토큰에서 데이터를 추출합니다.
func GetData(encodedToken string) (string, error) {
	// Base64 디코딩을 수행합니다.
	decodedToken, err := base64.StdEncoding.DecodeString(encodedToken)
	if err != nil {
		return "", err
	}

	fmt.Println("decodedToken:", string(decodedToken))

	claims := jwt.MapClaims{}
	// 토큰을 파싱합니다.
	token, err := jwt.ParseWithClaims(string(decodedToken), claims, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	fmt.Println("token:", token)

	if err != nil {
		return "", err
	}

	// 토큰이 유효한지 검사합니다.
	if !token.Valid {
		return "", fmt.Errorf("invalid token")
	}

	fmt.Println("claims:", claims)

	for key, val := range claims {
		fmt.Printf("key:%v, val:%v\n", key, val)
	}
	return "", nil
}
