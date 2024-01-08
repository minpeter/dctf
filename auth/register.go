package auth

import (
	"github.com/google/uuid"
	"github.com/minpeter/telos/database"
)

func UserRegister(division, email, name string, githubId int) (string, error) {

	userUuid := uuid.New().String()
	if err := database.MakeUser(userUuid, name, email, division, githubId, 0); err != nil {
		return "", err
	}

	return GetToken(userUuid)

}
