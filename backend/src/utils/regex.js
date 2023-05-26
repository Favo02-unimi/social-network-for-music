const username = "/^[a-zA-Z0-9]{4,16}$/"
const usernameDesc = "4-16 characters long, alpanumeric only"

// eslint-disable-next-line no-useless-escape
const email = "/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/"
const emailDesc = "local username before '@', domain after '@'"

export default {
  username, usernameDesc,
  email, emailDesc
}
