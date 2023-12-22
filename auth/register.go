package auth

import (
	"github.com/google/uuid"
	"github.com/minpeter/rctf-backend/database"
)

func UserRegister(division, email, name, ionId, ionData string) (Token, error) {

	userUuid := uuid.New().String()
	if err := database.MakeUser(userUuid, name, email, division, ionId, 0); err != nil {
		return "", err
	}

	return GetToken(Auth, TokenDataTypes{
		Auth: AuthTokenData(userUuid),
	})

}
