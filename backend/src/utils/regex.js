// disable useless-escape rule impacting regex
/* eslint no-useless-escape: 0 */

const username = /^[\w\s\-.,!?:]{4,50}$/
const usernameDesc = "4-16 characters long, alphanumeric with underscore"

const password = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/
const passwordDesc = "8-20 characters, at least one letter, one number and one special character (@$!%*#?&)"

const email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const emailDesc = "local username before '@', domain after '@'"

const title = /^[\w\s\-.,!?:]{4,50}$/
const titleDesc = "4-50 characters long, alphanumeric with underscore, space, hyphen, period, comma, exclamation mark, question mark, colon"

const description = /^[\w\s\-.,!?:\n]{4,200}$/
const descriptionDesc = "4-200 characters long, alphanumeric with underscore, space, hyphen, period, comma, exclamation mark, question mark, colon, new line"

const tag = /^[\w\s\-.,!?:]{2,16}$/
const tagDesc = "2-16 characters long, alphanumeric with underscore"

export default {
  username, usernameDesc,
  password, passwordDesc,
  email, emailDesc,
  title, titleDesc,
  description, descriptionDesc,
  tag, tagDesc
}
