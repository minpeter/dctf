package auth

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type TokenData struct {
	Kind     string
	Email    string
	Name     string
	Division string
}

type InternalTokenData struct {
	K string    //kind
	T int       //time
	D TokenData //data
}

func encryptToken(IT InternalTokenData) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["k"] = IT.K
	claims["t"] = IT.T
	claims["d"] = map[string]interface{}{
		"email":    IT.D.Email,
		"name":     IT.D.Name,
		"division": IT.D.Division,
	}
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func decryptToken(tokenString string) (InternalTokenData, error) {
	var IT InternalTokenData
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil {
		return IT, err
	}
	claims := token.Claims.(jwt.MapClaims)
	IT.K = claims["k"].(string)
	IT.T = int(claims["t"].(float64))
	IT.D.Email = claims["d"].(map[string]interface{})["email"].(string)
	IT.D.Name = claims["d"].(map[string]interface{})["name"].(string)
	IT.D.Division = claims["d"].(map[string]interface{})["division"].(string)
	return IT, nil
}

func GetData(tokenString string) (TokenData, error) {
	var IT InternalTokenData

	IT, err := decryptToken(tokenString)
	if err != nil {
		return IT.D, err
	}
	return IT.D, nil
}

func GetToken(TD TokenData) string {
	IT := InternalTokenData{
		K: TD.Kind,
		T: int(time.Now().Unix()),
		D: TD,
	}
	token, _ := encryptToken(IT)
	return token
}
