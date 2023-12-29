package database

import (
	"fmt"
	"time"
)

type Solve struct {
	Id          int64     `xorm:"pk autoincr"`
	ChallengeId string    `json:"challengeid"`
	Userid      string    `json:"userid"`
	CreatedAt   time.Time `json:"-" xorm:"created"`
}

func GetAllSolves() ([]Solve, error) {
	var solves []Solve
	err := DB.Find(&solves)
	if err != nil {
		return nil, err
	}

	return solves, nil
}

func GetSolvesByUserId(userid string) ([]Solve, error) {
	var solves []Solve
	err := DB.Where("userid = ?", userid).Find(&solves)
	if err != nil {
		return nil, err
	}

	return solves, nil
}

func GetSolvesByChallengeId(challengeid string) ([]Solve, error) {
	var solves []Solve
	err := DB.Where("challengeid = ?", challengeid).Find(&solves)
	if err != nil {
		return nil, err
	}

	return solves, nil
}

func GetSolvableChallengesByUserId(userid string) ([]Challenge, error) {
	var challenges []Challenge
	err := DB.Where("id NOT IN (SELECT challengeid FROM solves WHERE userid = ?)", userid).Find(&challenges)
	if err != nil {
		return nil, err
	}

	return challenges, nil
}

func NewSolve(solve Solve) error {
	_, err := DB.Insert(&solve)

	fmt.Println(err)
	if err != nil {
		return err
	}

	return nil
}

func RemoveSolvesByUserId(userid string) error {
	_, err := DB.Delete(&Solve{}, "userid = ?", userid)
	if err != nil {
		return err
	}

	return nil
}
