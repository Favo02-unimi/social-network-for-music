import axios from "axios"

const baseUrl = "/api/login"

const login = async (username : string, password : string) => {

  const user = {
    username: username,
    password: password
  }

  const res = await axios.post(baseUrl, user)

  return res.data
}

const verify = async (token : string) => {

  const headers = { headers: { "Authorization": `${token}` } }

  const res = await axios.get(`${baseUrl}/verify`, headers)

  return res.data
}

export default {
  login,
  verify
}
