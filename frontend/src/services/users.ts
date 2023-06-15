import axios from "axios"

const baseUrl = "/api/users"

/**
 * Get current logged user
 * @throws {401} missing/invalid token
 * @returns {200} current user
 */
const getMe = async () => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.get(`${baseUrl}/me`, headers)

  return res.data
}

/**
 * Create new user
 * @param {string} username of new user
 * @param {string} email of new user
 * @param {string} password of new user
 * @throws {401} missing/invalid token
 * @throws {401} invalid old password
 * @throws {400} invalid username/email/newPassoword
 * @throws {400} username already taken
 * @throws {400} email already taken
 * @returns {200} updated user
 */
const create = async (username : string, email : string, password : string) => {

  const user = {
    username,
    email,
    password
  }

  const res = await axios.post(`${baseUrl}/create`, user)

  return res.data
}

/**
 * Edit current user
 * @param {string} oldPassword current password of user
 * @param {string} username new username
 * @param {string} email new email
 * @param {string} newPassword new passord
 * @throws {400} invalid username
 * @throws {400} invalid email
 * @throws {400} invalid password
 * @throws {400} username already taken
 * @throws {400} email already taken
 * @returns {201} created user
 */
const edit = async (
  oldPassword : string,
  username : string,
  email : string,
  newPassword : string
) => {

  const user = {
    oldPassword,
    username,
    email,
    newPassword
  }

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.patch(`${baseUrl}/edit/`, user, headers)

  return res.data
}

/**
 * Delete current user
 * @param {string} password current password
 * @throws {401} missing/invalid token
 * @throws {401} invalid password
 * @returns {204}
 */
const deletee = async (password : string) => {

  const res = await axios.delete(`${baseUrl}/delete`, {
    headers: { "authorization": localStorage.getItem("token") },
    data: {
      oldPassword: password
    }
  })

  return res.data
}

const usersService = {
  getMe,
  create,
  edit,
  deletee
}

export default usersService
