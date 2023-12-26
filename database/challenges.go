package database

type Challenge struct {
	// Id는 pk 며 auto increment
	Id               string `json:"-" xorm:"pk"`
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
	Id      string `json:"-" xorm:"pk"`
	Minimum int    `json:"min"`
	Maximum int    `json:"max"`
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

func CreateChallenge(challenge Challenge) error {
	_, err := DB.Insert(challenge)
	if err != nil {
		return err
	}

	return nil
}
