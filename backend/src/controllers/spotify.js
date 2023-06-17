import express from "express"
import authenticateUser from "../middlewares/authenticateUser.js"
import fetchSpotify from "../spotify_utils/fetchSpotify.js"
import generateSpotifyToken from "../spotify_utils/generateSpotifyToken.js"
import checkSpotifyError from "../spotify_utils/checkSpotifyError.js"
import validateQuery from "../validations/Query.js"
import shuffleArray from "../utils/arrays.js"
import User from "../models/User.js"

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

  // validate
  const { valid, message } = validateQuery(query)
  if (!valid) {
    return res.status(400).json({ error: `Invalid search query${message}` })
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
    #swagger.summary = "Get artists filtered by {query} (AUTH required)"
  */

  const token = req.app.locals?.spotifyToken

  const query = req.params.query

  // validate
  const { valid, message } = validateQuery(query)
  if (!valid) {
    return res.status(400).json({ error: `Invalid search query${message}` })
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
    #swagger.summary = "Get tracks filtered by {query} (AUTH required)"
  */

  const token = req.app.locals?.spotifyToken

  const query = req.params.query

  // validate
  const { valid, message } = validateQuery(query)
  if (!valid) {
    return res.status(400).json({ error: `Invalid search query${message}` })
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
    #swagger.summary = "Get albums, artists, tracks filtered by {query} (AUTH required)"
  */

  const token = req.app.locals?.spotifyToken

  const query = req.params.query

  // validate
  const { valid, message } = validateQuery(query)
  if (!valid) {
    return res.status(400).json({ error: `Invalid search query${message}` })
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

/**
 * Fetch all genres
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
spotifyRouter.get("/genres", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Spotify"]
    #swagger.summary = "Get genres (AUTH required)"
  */

  const token = req.app.locals?.spotifyToken

  let spotifyResponse = await fetchSpotify.genres(token)

  // invalid token: refresh spotify token and retry one time
  if (spotifyResponse.status === 401) {
    const token = await generateSpotifyToken(req.app)
    spotifyResponse = await fetchSpotify.genres(token)
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
 * Fetch recommendations based on current user favourites
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
spotifyRouter.get("/recommendations", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Spotify"]
    #swagger.summary = "Get recommendations based on current user favourites (AUTH required)"
  */

  const token = req.app.locals?.spotifyToken

  const user = await User.findById(req.user.id)

  let artistsArr = user.favouriteArtists.map(a => a.id)
  let genresArr = user.favouriteGenres

  // enforce artists + genres = max 5 (max number of seed in spotify api):
  // merge arrays --> random shuffle --> pick 5 --> separate results
  if ((artistsArr.length + genresArr.length) > 5) {
    const combinedArray = [
      ...artistsArr.map(e => ({ value: e, source: 1 })),
      ...genresArr.map(e => ({ value: e, source: 2 }))
    ]
    const shuffled = shuffleArray(combinedArray).slice(0, 5)
    artistsArr = shuffled.filter(e => e.source === 1).map(e => e.value)
    genresArr = shuffled.filter(e => e.source === 2).map(e => e.value)
  }

  const artists = artistsArr.join(",")
  const genres = genresArr.join(",")

  if (!artists && !genres) {
    return res.status(400).json({ error: "No favourite genres or artists: cannot generate recommendations" })
  }

  let spotifyResponse = await fetchSpotify.recommendations(token, artists, genres)

  // invalid token: refresh spotify token and retry one time
  if (spotifyResponse.status === 401) {
    const token = await generateSpotifyToken(req.app)
    spotifyResponse = await fetchSpotify.recommendations(token, artists, genres)
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
 * Fetch track
 * @param {string} id of track to fetch
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
spotifyRouter.get("/track/:id", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Spotify"]
    #swagger.summary = "Get specific track (AUTH required)"
  */

  const token = req.app.locals?.spotifyToken

  const trackId = req.params.id

  let spotifyResponse = await fetchSpotify.track(token, trackId)

  // invalid token: refresh spotify token and retry one time
  if (spotifyResponse.status === 401) {
    const token = await generateSpotifyToken(req.app)
    spotifyResponse = await fetchSpotify.track(token, trackId)
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
