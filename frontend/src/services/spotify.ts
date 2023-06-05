import axios from "axios"

const baseUrl = "/api/spotify"

const albums = async (query : string) => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.get(`${baseUrl}/albums/${query}`, headers)

  return res.data
}

const artists = async (query : string) => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.get(`${baseUrl}/artists/${query}`, headers)

  return res.data
}

const tracks = async (query : string) => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.get(`${baseUrl}/tracks/${query}`, headers)

  return res.data
}

const all = async (query : string) => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.get(`${baseUrl}/all/${query}`, headers)

  return res.data
}

const spotifyService = {
  albums,
  artists,
  tracks,
  all
}

export default spotifyService
