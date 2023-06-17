import axios from "axios"

const baseUrl = "/api/spotify"

/**
 * Search albums by @param query filter
 * @param {string} query filter
 * @requires authorization header (JWT token)
 * @throws {401} missing/invalid token
 * @throws {400} invalid query
 * @returns {200} albums
 */
const albums = async (query : string) => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.get(`${baseUrl}/albums/${query}`, headers)

  return res.data
}

/**
 * Search artists by @param query filter
 * @param {string} query filter
 * @requires authorization header (JWT token)
 * @throws {401} missing/invalid token
 * @throws {400} invalid query
 * @returns {200} artists
 */
const artists = async (query : string) => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.get(`${baseUrl}/artists/${query}`, headers)

  return res.data
}

/**
 * Search tracks by @param query filter
 * @param {string} query filter
 * @requires authorization header (JWT token)
 * @throws {401} missing/invalid token
 * @throws {400} invalid query
 * @returns {200} tracks
 */
const tracks = async (query : string) => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.get(`${baseUrl}/tracks/${query}`, headers)

  return res.data
}

/**
 * Search albums, artists, tracks by @param query filter
 * @param {string} query filter
 * @requires authorization header (JWT token)
 * @throws {401} missing/invalid token
 * @throws {400} invalid query
 * @returns {200} albums, artists, tracks
 */
const all = async (query : string) => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.get(`${baseUrl}/all/${query}`, headers)

  return res.data
}

/**
 * Fetch genres
 * @requires authorization header (JWT token)
 * @throws {401} missing/invalid token
 * @returns {200} genres
 */
const genres = async () => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.get(`${baseUrl}/genres`, headers)

  return res.data
}

/**
 * Fetch user recommendations
 * @requires authorization header (JWT token)
 * @throws {401} missing/invalid token
 * @throws {400} no favourites to generate recommendations
 * @returns {200} recommendations
 */
const recommendations = async () => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.get(`${baseUrl}/recommendations`, headers)

  return res.data
}

/**
 * Fetch single track
 * @param {string} id of track
 * @requires authorization header (JWT token)
 * @throws {401} missing/invalid token
 * @returns {200} recommendations
 */
const track = async (id : string) => {

  const headers = { headers: { "authorization": localStorage.getItem("token") } }

  const res = await axios.get(`${baseUrl}/track/${id}`, headers)

  return res.data
}

const spotifyService = {
  albums,
  artists,
  tracks,
  all,
  genres,
  recommendations,
  track
}

export default spotifyService
