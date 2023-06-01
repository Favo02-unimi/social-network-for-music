import express from "express"
import REGEX from "../utils/regex.js"
import authenticateUser from "../middlewares/authenticateUser.js"

import fetchSpotify from "../spotify_utils/fetchSpotify.js"
import generateSpotifyToken from "../spotify_utils/generateSpotifyToken.js"
import checkSpotifyError from "../spotify_utils/checkSpotifyError.js"


const spotifyRouter = express.Router()

/**
 * Search albums filtered by @param query
 * @param {string} query to filter albums
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
spotifyRouter.get("/albums/:query", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Spotify"]
    #swagger.summary = "Get albums filtered by {query} (AUTH required)"
  */

  const token = req.app.locals?.spotifyToken

  const query = req.params.query
  if (!query || !REGEX.query.test(query)) {
    return res.status(400).json({ error: `Enter a valid search query: ${REGEX.queryDesc}` })
  }

  let spotifyResponse = await fetchSpotify.albums(token, query)

  // invalid token: refresh spotify token and retry one time
  if (spotifyResponse.status === 401) {
    const token = await generateSpotifyToken(req.app)
    spotifyResponse = await fetchSpotify.albums(token, query)
  }

  // check for spotify api errors after token refresh
  // undefined == no errors
  const errorJson = checkSpotifyError(spotifyResponse.status)

  return res
    .status(spotifyResponse.status)
    // if error found return errorJson, otherwise response json
    .json(errorJson ?? await spotifyResponse.json())
})

/**
 * Search artists filtered by @param query
 * @param {string} query to filter artists
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
spotifyRouter.get("/artists/:query", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Spotify"]
    #swagger.summary = "Get artists filtered by {query}"
  */

  const token = req.app.locals?.spotifyToken

  const query = req.params.query
  if (!query || !REGEX.query.test(query)) {
    return res.status(400).json({ error: `Enter a valid search query: ${REGEX.queryDesc}` })
  }

  let spotifyResponse = await fetchSpotify.artists(token, query)

  // invalid token: refresh spotify token and retry one time
  if (spotifyResponse.status === 401) {
    const token = await generateSpotifyToken(req.app)
    spotifyResponse = await fetchSpotify.artists(token, query)
  }

  // check for spotify api errors after token refresh
  // undefined == no errors
  const errorJson = checkSpotifyError(spotifyResponse.status)

  return res
    .status(spotifyResponse.status)
    // if error found return errorJson, otherwise response json
    .json(errorJson ?? await spotifyResponse.json())
})

/**
 * Search tracks filtered by @param query
 * @param {string} query to filter tracks
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
spotifyRouter.get("/tracks/:query", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Spotify"]
    #swagger.summary = "Get tracks filtered by {query}"
  */

  const token = req.app.locals?.spotifyToken

  const query = req.params.query
  if (!query || !REGEX.query.test(query)) {
    return res.status(400).json({ error: `Enter a valid search query: ${REGEX.queryDesc}` })
  }

  let spotifyResponse = await fetchSpotify.tracks(token, query)

  // invalid token: refresh spotify token and retry one time
  if (spotifyResponse.status === 401) {
    const token = await generateSpotifyToken(req.app)
    spotifyResponse = await fetchSpotify.tracks(token, query)
  }

  // check for spotify api errors after token refresh
  // undefined == no errors
  const errorJson = checkSpotifyError(spotifyResponse.status)

  return res
    .status(spotifyResponse.status)
    // if error found return errorJson, otherwise response json
    .json(errorJson ?? await spotifyResponse.json())
})

/**
 * Search albums, artists or tracks filtered by @param query
 * @param {string} query to filter albums, artists or tracks
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
spotifyRouter.get("/all/:query", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Spotify"]
    #swagger.summary = "Get albums, artists, tracks filtered by {query}"
  */

  const token = req.app.locals?.spotifyToken

  const query = req.params.query
  if (!query || !REGEX.query.test(query)) {
    return res.status(400).json({ error: `Enter a valid search query: ${REGEX.queryDesc}` })
  }

  let spotifyResponse = await fetchSpotify.all(token, query)

  // invalid token: refresh spotify token and retry one time
  if (spotifyResponse.status === 401) {
    const token = await generateSpotifyToken(req.app)
    spotifyResponse = await fetchSpotify.all(token, query)
  }

  // check for spotify api errors after token refresh
  // undefined == no errors
  const errorJson = checkSpotifyError(spotifyResponse.status)

  return res
    .status(spotifyResponse.status)
    // if error found return errorJson, otherwise response json
    .json(errorJson ?? await spotifyResponse.json())
})

export default spotifyRouter
