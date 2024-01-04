package database_test

import (
	"fmt"
	"os"
	"testing"

	"github.com/minpeter/dctf-backend/database"
)

func TestCreateChallenge(t *testing.T) {

	// dctf.db 삭제

	if err := os.Remove("dctf.db"); err != nil {
		t.Error(err)
	}

	if err := database.ConnectDatabase(); err != nil {
		t.Error(err)
	}

	newChall := database.Challenge{
		Name:        "test",
		Description: "test",
		Category:    "test",
		Author:      "test",
		Files: []database.File{
			{
				Name: "test",
				Url:  "test",
			},
		},
		Points: database.Points{
			Max: 300,
			Min: 200,
		},
		Flag:             "test",
		TiebreakEligible: false,
		SortWeight:       0,
	}

	if err := database.PutChallenge(newChall); err != nil {
		t.Error(err)
	}

	challs, err := database.GetAllChallenges()
	if err != nil {
		t.Error(err)
	}

	fmt.Println(challs)
}
