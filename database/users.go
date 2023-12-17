package database

type User struct {
	Id        string `xorm:"pk"`
	Name      string
	Email     string
	Division  string
	CtftimeId string
	Perms     int
}

func MakeUser(id string, name string, email string, division string, ctftimeId string, perms int) error {
	_, err := DB.Insert(&User{
		Id:        id,
		Name:      name,
		Email:     email,
		Division:  division,
		CtftimeId: ctftimeId,
		Perms:     perms,
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

func GetUserById(id string) (User, error) {
	var user User
	_, err := DB.Where("id = ?", id).Get(&user)
	return user, err
}
