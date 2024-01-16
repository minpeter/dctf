package database

import "fmt"

type User struct {
	Id       string `xorm:"pk"`
	Name     string
	Email    string
	Division string
	GithubId int
	Perms    int
}

func MakeUser(id, name, email, division string, githubId, perms int) error {

	fmt.Println("called database.MakeUser with GithubId: ", githubId)

	if id == "" || name == "" || email == "" || division == "" || githubId == 0 {
		return fmt.Errorf("missing required fields")
	}

	empty, err := DB.IsTableEmpty(&User{})
	if err != nil {
		return err
	}
	if empty {
		perms = 3
	}

	_, err = DB.Insert(&User{
		Id:       id,
		Name:     name,
		Email:    email,
		Division: division,
		GithubId: githubId,
		Perms:    perms,
	})
	return err
}

func GetAllUsers() ([]User, error) {
	var users []User
	err := DB.Find(&users)
	return users, err
}

func GetuserByGithubId(githubId int) (User, bool, error) {

	fmt.Println("called database.GetuserByGithubId with githubId: ", githubId)

	var user User
	has, err := DB.Where("github_id = ?", githubId).Get(&user)
	return user, has, err
}

func GetUserById(id string) (User, bool, error) {

	fmt.Println("called database.GetUserById with id: ", id)

	var user User
	has, err := DB.Where("id = ?", id).Get(&user)
	return user, has, err
}
