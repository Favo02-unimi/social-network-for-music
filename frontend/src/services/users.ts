import axios from "axios"

const baseUrl = "/api/users"

const create = async (username : string, email : string, password : string) => {

  const user = {
    username,
    email,
    password
  }

  const res = await axios.post(`${baseUrl}/create`, user)

  return res.data
}

const usersService = {
  create
}

export default usersService
