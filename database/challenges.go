package database

import "fmt"

type Challenge struct {
	Id               string  `json:"id" xorm:"pk"`
	Name             string  `json:"name"`
	Description      string  `json:"description"`
	Category         string  `json:"category"`
	Author           string  `json:"author"`
	Files            []File  `json:"files" xorm:"jsonb"`
	Points           Points  `json:"points" xorm:"jsonb notnull"`
	Flag             string  `json:"flag"`
	TiebreakEligible bool    `json:"tiebreakEligible"`
	SortWeight       int     `json:"sortWeight"`
	Dynamic          Dynamic `json:"dynamic" xorm:"jsonb"`
}

type Dynamic struct {
	Image string `json:"image"`
	Type  string `json:"type"`
	Env   string `json:"env"`
}

type File struct {
	Name string `json:"name"`
	Url  string `json:"url"`
}

type Points struct {
	Min int `json:"min"`
	Max int `json:"max"`
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
	Dynamic     string `json:"dynamic"`
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

		count, err := GetSolvesCountByChallengeId(challenge.Id)
		if err != nil {
			return nil, err
		}

		var dynamicType string
		if challenge.Dynamic.Type != "" && challenge.Dynamic.Image != "" {
			dynamicType = challenge.Dynamic.Type
		} else {
			dynamicType = "static"
		}

		cleanedChallenges = append(cleanedChallenges, CleanedChallenge{
			Id:          challenge.Id,
			Name:        challenge.Name,
			Description: challenge.Description,
			Category:    challenge.Category,
			Author:      challenge.Author,
			Files:       challenge.Files,
			Points:      challenge.Points.Max,
			Solves:      int(count),
			Dynamic:     dynamicType,
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

	if challenge.Dynamic.Type != "static" && challenge.Dynamic.Type != "" && challenge.Dynamic.Type != "http" && challenge.Dynamic.Type != "tcp" {
		return fmt.Errorf("invalid dynamic type")
	}

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
