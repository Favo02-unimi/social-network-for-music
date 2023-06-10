import axios from "axios"

import type Track from "../interfaces/Track"

const baseUrl = "/api/playlists"

const getPublic = async () => {

  const res = await axios.get(`${baseUrl}/public`)

  return res.data
}

const getSingle = async (id : string) => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.get(`${baseUrl}/${id}`, headers)

  return res.data
}

const getAll = async () => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.get(`${baseUrl}/`, headers)

  return res.data
}

const create = async (
  title : string,
  description : string,
  isPublic : boolean,
  tags ?: string[]
) => {

  const user = {
    title,
    description,
    isPublic,
    tags
  }

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.post(`${baseUrl}/create`, user, headers)

  return res.data
}

const addTrack = async(id : string, track : Track) => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.post(`${baseUrl}/${id}/add`, { track }, headers)

  return res.data
}

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.post(`${baseUrl}/${id}/add`, trackBody, headers)

  return res.data
}

const playlistsService = {
  getPublic,
  getSingle,
  getAll,
  create,
  addTrack
}

export default playlistsService
