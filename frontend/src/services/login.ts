import axios from "axios"

const baseUrl = "/api/login"

/**
 * Login and generate JWT token
 * @param {string} username of user to login
 * @param {string} password of user to login
 * @throws {401} missing username
 * @throws {401} missing password
 * @throws {401} invalid username
 * @throws {401} invalid password
 * @returns {200} JWT token
 */
const login = async (username : string, password : string) => {

  const user = {
    username: username,
    password: password
  }

  const res = await axios.post(baseUrl, user)

  return res.data
}

/**
 * Verify login
 * @param {string} token of user to verify login
 * @requires authorization header (JWT token)
 * @throws {401} missing/invalid token
 * @returns {200} logged user
 */
const verify = async (token : string) => {

  const headers = { headers: { "Authorization": `${token}` } }

  const res = await axios.get(`${baseUrl}/verify`, headers)

  return res.data
}

export default {
  login,
  verify
}
