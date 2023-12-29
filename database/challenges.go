package database

import "fmt"

type Challenge struct {
	Id               string `json:"id" xorm:"pk"`
	Name             string `json:"name"`
	Description      string `json:"description"`
	Category         string `json:"category"`
	Author           string `json:"author"`
	Files            []File `json:"files"`
	Points           Points `json:"points"`
	Flag             string `json:"flag"`
	TiebreakEligible bool   `json:"tiebreakEligible"`
	SortWeight       int    `json:"sortWeight"`
}

type File struct {
	Id   string `json:"-" xorm:"pk"`
	Name string `json:"name"`
	Url  string `json:"url"`
}

type Points struct {
	Id  string `json:"-" xorm:"pk"`
	Min int    `json:"min"`
	Max int    `json:"max"`
}

type CleanedChallenge struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Author      string `json:"author"`
	Files       []File `json:"files"`
	Points      int    `json:"points"`
	Solves      int    `json:"solves"`
}

func GetChallengeById(id string) (Challenge, error) {
	var challenge Challenge
	has, err := DB.Where("id = ?", id).Get(&challenge)
	if err != nil {
		return Challenge{}, err
	}

	if !has {
		return Challenge{}, fmt.Errorf("challenge not found")
	}

	return challenge, nil
}

func GetAllChallenges() ([]Challenge, error) {
	var challenges []Challenge
	err := DB.Find(&challenges)
	if err != nil {
		return nil, err
	}

	for i := range challenges {
		if challenges[i].Files == nil {
			challenges[i].Files = []File{}
		}
	}

	return challenges, nil

}

func GetCleanedChallenges() ([]CleanedChallenge, error) {
	var challenges []Challenge
	err := DB.Find(&challenges)
	if err != nil {
		return nil, err
	}

	for i := range challenges {
		if challenges[i].Files == nil {
			challenges[i].Files = []File{}
		}
	}

	var cleanedChallenges []CleanedChallenge
	for _, challenge := range challenges {
		cleanedChallenges = append(cleanedChallenges, CleanedChallenge{
			Id:          challenge.Id,
			Name:        challenge.Name,
			Description: challenge.Description,
			Category:    challenge.Category,
			Author:      challenge.Author,
			Files:       challenge.Files,
			Points:      challenge.Points.Max,
			Solves:      0,
		})
	}

	return cleanedChallenges, nil
}

func DeleteChallenge(id string) error {
	_, err := DB.Delete(&Challenge{Id: id})
	if err != nil {
		return err
	}

	return nil
}

func PutChallenge(challenge Challenge) error {
	has, err := DB.Where("id = ?", challenge.Id).Exist(&Challenge{})

	fmt.Println("id:", challenge.Id)
	if err != nil {
		return err
	}

	if has {
		_, err = DB.Where("id = ?", challenge.Id).Update(&challenge)
		if err != nil {
			return err
		}

	} else {
		_, err = DB.Insert(&challenge)
		if err != nil {
			return err
		}
	}

	return nil
}
