package database

type User struct {
	Id       string `xorm:"pk"`
	Name     string
	Email    string
	Division string
	GithubId string
	Perms    int
}

func MakeUser(id string, name string, email string, division string, githubId string, perms int) error {
	_, err := DB.Insert(&User{
		Id:       id,
		Name:     name,
		Email:    email,
		Division: division,
		GithubId: githubId,
		Perms:    perms,
	})
	return err
}

func GetUserByNameOrEmail(name string, email string) (User, error) {
	var user User
	_, err := DB.Where("name = ? OR email = ?", name, email).Get(&user)
	return user, err
}

func GetAllUsers() ([]User, error) {
	var users []User
	err := DB.Find(&users)
	return users, err
}

func GetUserById(id string) (User, bool, error) {
	var user User
	has, err := DB.Where("id = ?", id).Get(&user)
	return user, has, err
}
