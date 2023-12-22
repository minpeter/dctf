package database_test

import (
	"testing"

	"github.com/minpeter/rctf-backend/database"
)

func TestGetUserById(t *testing.T) {

	if err := database.ConnectDatabase(); err != nil {
		t.Errorf("Error connecting to database: %s", err)
	}

	_, has, err := database.GetUserById("test")
	if err != nil {
		t.Errorf("이게 나오면 안되는건데..? 111")
	}

	if has {
		t.Errorf("이게 나오면 안되는건데..? 222")
	}
}
