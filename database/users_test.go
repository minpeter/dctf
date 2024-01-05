package database_test

import (
	"fmt"
	"os"
	"testing"

	"github.com/google/uuid"
	"github.com/minpeter/telos-backend/database"
)

func TestMakeUser(t *testing.T) {

	// telos.db 삭제

	if err := os.Remove("telos.db"); err != nil {
		t.Error(err)
	}

	if err := database.ConnectDatabase(); err != nil {
		t.Error(err)
	}

	for i := 0; i < 3; i++ {
		if err := database.MakeUser(uuid.New().String(), fmt.Sprintf("test%d", i), fmt.Sprintf("test %d", i), "open", "", 0); err != nil {
			t.Error(err)
		}
	}

	// 첫번째 유저만 perms가 3인지 확인
	users, err := database.GetAllUsers()
	if err != nil {
		t.Error(err)
	}

	if users[0].Perms != 3 {
		t.Error("perms is not 3")
	}

	// 두번째 유저의 perms를 1로 변경
	if users[1].Perms != 0 {
		t.Error("perms is not 0")
	}
}
