package database

import (
	"fmt"
	"time"
)

type Solve struct {
	Id          int64     `xorm:"pk autoincr"`
	Challengeid string    `json:"challengeid"`
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
	err := DB.Where("challenge_id = ?", challengeid).Find(&solves)
	if err != nil {
		return nil, err
	}

	return solves, nil
}

func GetSolvableChallengesByUserId(userid string) ([]Challenge, error) {
	var challenges []Challenge
	err := DB.Where("id NOT IN (SELECT challenge_id FROM solves WHERE userid = ?)", userid).Find(&challenges)
	if err != nil {
		return nil, err
	}

	return challenges, nil
}

func NewSolve(solve Solve) error {

	// 이미 해당 유저가 문제를 풀었는지 확인
	has, err := DB.Where("challengeid = ? AND userid = ?", solve.Challengeid, solve.Userid).Get(&Solve{})
	if err != nil {
		fmt.Println("err:", err)
		return err
	}

	if has {
		return nil
	}

	_, err = DB.Insert(&solve)
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
