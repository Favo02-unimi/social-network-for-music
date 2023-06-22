import axios from "axios"

import type Track from "../interfaces/Track"

const baseUrl = "/api/playlists"

/**
 * Get public playlists
 * @returns {200} public playlists
 */
const getPublic = async () => {

  const res = await axios.get(`${baseUrl}/public`)

  return res.data
}


/**
 * Get single @param id playlist
 * @param {string} id of playlist to get
 * @requires authorization header (JWT token)
 * @throws {401} missing/invalid token
 * @throws {404} playlist not found
 * @throws {401} private playlist and user not creator/collaborator
 * @returns {200} playlist
 */
const getSingle = async (id : string) => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.get(`${baseUrl}/${id}`, headers)

  return res.data
}

/**
 * Get all playlists followed by user
 * @requires authorization header (JWT token)
 * @throws {401} missing/invalid token
 * @returns {200} playlist
 */
const getAll = async () => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.get(`${baseUrl}/`, headers)

  return res.data
}

/**
 * Create new playlist
 * @param {string} title of playlist to create
 * @param {string} description of playlist to create
 * @param {boolean} isPublic private/public setting of playlist
 * @param {undefined | string[]} tags of playlist to create
 * @requires authorization header (JWT token)
 * @throws {401} missing/invalid token
 * @throws {400} invalid title
 * @throws {400} invalid description
 * @throws {400} invalid tags
 * @returns {201} created playlist
 */
const create = async (
  title : string,
  description : string,
  isPublic : boolean,
  tags ?: string[]
) => {

  const playlist = {
    title,
    description,
    isPublic,
    tags
  }

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.post(`${baseUrl}/create`, playlist, headers)

  return res.data
}

/**
 * Edit @param id playlist
 * @param {string} id playlist to edit
 * @param {string} title new title of playlist
 * @param {string} description new description of playlist
 * @param {boolean} isPublic new private/public public of playlist
 * @param {undefined | string[]} tags new tags of playlist to create
 * @requires authorization header (JWT token)
 * @throws {401} missing/invalid token
 * @throws {404} playlist not found
 * @throws {401} user not creator/collaborator of playlist
 * @throws {400} invalid title
 * @throws {400} invalid description
 * @throws {400} invalid tags
 * @returns {200} updated playlist
 */
const edit = async (
  id : string,
  title : string,
  description : string,
  isPublic : boolean,
  tags ?: string[]
) => {

  const playlist = {
    title,
    description,
    isPublic,
    tags
  }

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.patch(`${baseUrl}/edit/${id}`, playlist, headers)

  return res.data
}

/**
 * Delete @param id playlist
 * @param {string} id playlist to delete
 * @requires authorization header (JWT token)
 * @throws {401} missing/invalid token
 * @throws {404} playlist not found
 * @throws {401} user not creator of playlist
 * @returns {204}
 */
const deletee = async(id : string) => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.delete(`${baseUrl}/delete/${id}`, headers)

  return res.data
}

/**
 * Add @param track to @param id playlist
 * @param {string} id playlist to add track
 * @param {Track} track to add to playlist
 * @requires authorization header (JWT token)
 * @throws {401} missing/invalid token
 * @throws {404} playlist not found
 * @throws {401} user not creator/collaborator of playlist
 * @throws {400} track already in playlist
 * @returns {200} updated playlist
 */
const addTrack = async(id : string, track : Track) => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.post(`${baseUrl}/${id}/add`, { track }, headers)

  return res.data
}

/**
 * Remove track @param trackId from @param id playlist
 * @param {string} id playlist to remove track
 * @param {string} trackId of track to remove
 * @requires authorization header (JWT token)
 * @throws {401} missing/invalid token
 * @throws {404} playlist not found
 * @throws {401} user not creator/collaborator of playlist
 * @throws {404} track not found in playlist
 * @returns {200} updated playlist
 */
const removeTrack = async(id : string, trackId : string) => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.delete(`${baseUrl}/${id}/remove/${trackId}`, headers)

  return res.data
}

/**
 * Current user follow @param id playlist
 * @param {string} id playlist to follow
 * @requires authorization header (JWT token)
 * @throws {401} missing/invalid token
 * @throws {404} playlist not found
 * @throws {400} playlist already followed
 * @returns {200} updated playlist
 */
const follow = async (id : string) => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.post(`${baseUrl}/${id}/follow`, {}, headers)

  return res.data
}

/**
 * Current user unfollow @param id playlist
 * @param {string} id playlist to unfollow
 * @requires authorization header (JWT token)
 * @throws {401} missing/invalid token
 * @throws {404} playlist not found
 * @throws {400} playlist not followed
 * @throws {400} user is creator of playlist
 * @returns {200} updated playlist
 */
const unfollow = async (id : string) => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.post(`${baseUrl}/${id}/unfollow`, {}, headers)

  return res.data
}

/**
 * Get @param id playlist followers
 * @param {string} id of playlist to get followers
 * @requires authorization header (JWT token)
 * @throws {401} missing/invalid token
 * @throws {404} playlist not found
 * @throws {401} private playlist and user not creator/collaborator
 * @returns {200} playlist
 */
const followers = async (id : string) => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.get(`${baseUrl}/${id}/followers`, headers)

  return res.data
}

/**
 * Make @param userId collaborator of @param playlistId playlist
 * @param {string} playlistId playlist to add collaborator
 * @param {string} userId user to make collaborator
 * @requires authorization header (JWT token)
 * @throws {401} missing/invalid token
 * @throws {404} playlist not found
 * @throws {401} current user not creator
 * @throws {400} user to make collaborator not follower of playlist
 * @returns {200} updated playlist
 */
const addCollaborator = async (playlistId : string, userId : string) => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.post(`${baseUrl}/${playlistId}/addcollaborator/${userId}`, {}, headers)

  return res.data
}

/**
 * Remove @param userId collaborator from @param playlistId playlist
 * @param {string} playlistId playlist to remove collaborator
 * @param {string} userId user to remove collaborator
 * @requires authorization header (JWT token)
 * @throws {401} missing/invalid token
 * @throws {404} playlist not found
 * @throws {401} current user not creator
 * @throws {400} user to remove collaborator not collaborator of playlist
 * @returns {200} updated playlist
 */
const removeCollaborator = async (playlistId : string, userId : string) => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.post(`${baseUrl}/${playlistId}/removecollaborator/${userId}`, {}, headers)

  return res.data
}

const playlistsService = {
  getPublic,
  getSingle,
  getAll,
  create,
  edit,
  deletee,
  addTrack,
  removeTrack,
  follow,
  unfollow,
  followers,
  addCollaborator,
  removeCollaborator
}

export default playlistsService
