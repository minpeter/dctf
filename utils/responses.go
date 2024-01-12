package utils

import "github.com/gin-gonic/gin"

type Response struct {
	Kind    string      `json:"kind"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
	Status  int         `json:"-"`
}

func SendResponse(c *gin.Context, kind string, data interface{}) {

	res, ok := Responses[kind]
	if !ok {
		res = Responses["errorInternal"]
	}

	res.Kind = kind
	res.Data = data

	c.JSON(res.Status, res)
}

var Responses = map[string]Response{
	"goodAuth": {
		Status:  200,
		Message: "The user is authenticated.",
	},
	"goodGithubUrl": {
		Status:  200,
		Message: "The Github login URL was retrieved.",
	},
	"goodUserCheck": {
		Status:  200,
		Message: "The user is logged in.",
	},
	"badAlreadyRegistered": {
		Status:  409,
		Message: "The user is already registered.\nThis doesn't usually happen. Contact sysadmin.",
	},
	"badRegister": {
		Status:  400,
		Message: "The user could not be created. Please try again.",
	},
	"goodLogout": {
		Status:  200,
		Message: "The logout was successful.",
	},
	"goodAdminCheck": {
		Status:  200,
		Message: "The user is an admin.",
	},
	"goodStartInstance": {
		Status:  200,
		Message: "The instance was started.",
	},
	"goodStopInstance": {
		Status:  200,
		Message: "The instance was stopped.",
	},
	"goodVerify": {
		Status:  200,
		Message: "The email was verified.",
	},
	"goodRegister": {
		Status:  200,
		Message: "The user was created.",
	},
	"goodLogin": {
		Status:  200,
		Message: "The login was successful.",
	},
	"goodVerifySent": {
		Status:  200,
		Message: "The account verification email was sent.",
	},
	"badEmail": {
		Status:  400,
		Message: "The email address is malformed.",
	},
	"badCompetitionNotAllowed": {
		Status:  403,
		Message: "You are not allowed to join this CTF.",
	},
	"badDivisionNotAllowed": {
		Status:  403,
		Message: "You are not allowed to join this division.",
	},
	"badEmailChangeDivision": {
		Status:  403,
		Message: "You are not allowed to stay in your division with this email.",
	},
	"badUnknownUser": {
		Status:  404,
		Message: "The user does not exist.",
	},
	"badUnknownEmail": {
		Status:  404,
		Message: "The account does not exist.",
	},
	"badKnownEmail": {
		Status:  409,
		Message: "An account with this email already exists.",
	},
	"badKnownName": {
		Status:  409,
		Message: "An account with this name already exists.",
	},
	"badName": {
		Status:  400,
		Message: "The name should only use English letters, numbers, and symbols.",
	},
	"badKnownGithubId": {
		Status:  409,
		Message: "An account with this Github ID already exists.",
	},
	"goodLeaderboard": {
		Status:  200,
		Message: "The leaderboard was retrieved.",
	},
	"goodGithubLeaderboard": {
		Status:  200,
		Message: "",
	},
	"goodGithubToken": {
		Status:  200,
		Message: "The Github token was created.",
	},
	"goodGithubSet": {
		Status:  200,
		Message: "The Github team was successfully updated.",
	},
	"goodGithubRemoved": {
		Status:  200,
		Message: "The Github team was removed from the user.",
	},
	"goodEmailSet": {
		Status:  200,
		Message: "The email was successfully updated.",
	},
	"goodEmailRemoved": {
		Status:  200,
		Message: "The email address was removed from the user.",
	},
	"badGithubNoExists": {
		Status:  404,
		Message: "There is no Github team associated with the user.",
	},
	"badZeroAuth": {
		Status:  409,
		Message: "At least one authentication method is required.",
	},
	"badEmailNoExists": {
		Status:  404,
		Message: "There is no email address associated with the user.",
	},
	"badGithubCode": {
		Status:  401,
		Message: "The Github code is invalid.",
	},
	"goodFlag": {
		Status:  200,
		Message: "The flag is correct.",
	},
	"badFlag": {
		Status:  400,
		Message: "The flag was incorrect.",
	},
	"badChallenge": {
		Status:  404,
		Message: "The challenge could not be found.",
	},
	"badAlreadySolvedChallenge": {
		Status:  409,
		Message: "The flag was already submitted",
	},
	"goodToken": {
		Status:  200,
		Message: "The authorization token is valid",
	},
	"goodFilesUpload": {
		Status:  200,
		Message: "The files were successfully uploaded",
	},
	"goodUploadsQuery": {
		Status:  200,
		Message: "The status of uploads was successfully queried",
	},
	"badFilesUpload": {
		Status:  500,
		Message: "The upload of files failed",
	},
	"badDataUri": {
		Status:  400,
		Message: "A data URI provided was malformed",
	},
	"badBody": {
		Status:  400,
		Message: "The request body does not meet requirements.",
	},
	"badToken": {
		Status:  401,
		Message: "The token provided is invalid.",
	},
	"badTokenVerification": {
		Status:  401,
		Message: "The token provided is invalid.",
	},
	"badGithubToken": {
		Status:  401,
		Message: "The Github token provided is invalid.",
	},
	"badJson": {
		Status:  400,
		Message: "The request JSON body is malformed.",
	},
	"badEndpoint": {
		Status:  404,
		Message: "The request endpoint could not be found.",
	},
	"badNotStarted": {
		Status:  401,
		Message: "The CTF has not started yet.",
	},
	"badEnded": {
		Status:  401,
		Message: "The CTF has ended.",
	},
	"badRateLimit": {
		Status:  429,
		Message: "You are trying this too fast",
	},
	"goodChallenges": {
		Status:  200,
		Message: "The retrieval of challenges was successful.",
	},
	"goodChallengeSolves": {
		Status:  200,
		Message: "The challenges solves have been retrieved.",
	},
	"goodChallengeUpdate": {
		Status:  200,
		Message: "Challenge successfully updated",
	},
	"goodChallengeDelete": {
		Status:  200,
		Message: "Challenge successfully deleted",
	},
	"goodUserData": {
		Status:  200,
		Message: "The user data was successfully retrieved.",
	},
	"goodUserUpdate": {
		Status:  200,
		Message: "Your account was successfully updated",
	},
	"goodMemberCreate": {
		Status:  200,
		Message: "Team member successfully created",
	},
	"goodMemberDelete": {
		Status:  200,
		Message: "Team member successfully deleted",
	},
	"goodMemberData": {
		Status:  200,
		Message: "The team member data was successfully retrieved",
	},
	"badPerms": {
		Status:  403,
		Message: "The user does not have required permissions.",
	},
	"goodClientConfig": {
		Status:  200,
		Message: "The client config was retrieved.",
	},
	"badRecaptchaCode": {
		Status:  401,
		Message: "The recaptcha code is invalid.",
	},
	"errorInternal": {
		Status:  500,
		Message: "An internal error occurred.",
	}}
