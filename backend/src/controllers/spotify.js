import express from "express"
import fetchToken from "../utils/spotifyToken.js"
import spotifyAPI from "../utils/spotifyAPI.js"

const spotifyRouter = express.Router()

/**
 * Generate a Bearer token for Spotify API
 * @returns {Response}
 */
spotifyRouter.get("/token", async (req, res) => {
  /*
    #swagger.tags = ["Spotify"]
    #swagger.summary = "Generate a spotify API token"
  */

  const spotifyResponse = await fetchToken()
  return res.status(spotifyResponse.status).json(await spotifyResponse.json())
})

/**
 * Search albums filtered by @param query
 * @param {string} query to filter albums
 * @requires spotifyauthorization header (Bearer token)
 * @returns {Response}
 */
spotifyRouter.get("/albums/:query", async (req, res) => {
  /*
    #swagger.tags = ["Spotify"]
    #swagger.summary = "Get albums filtered by {query}"
  */

  // TODO: req has spotifyauthorization header
  const token = req.headers.spotifyauthorization
  // TODO: query validation
  const query = req.params.query

  const spotifyResponse = await spotifyAPI.albums(token, query)
  return res.status(spotifyResponse.status).json(await spotifyResponse.json())
})

/**
 * Search artists filtered by @param query
 * @param {string} query to filter artists
 * @requires spotifyauthorization header (Bearer token)
 * @returns {Response}
 */
spotifyRouter.get("/artists/:query", async (req, res) => {
  /*
    #swagger.tags = ["Spotify"]
    #swagger.summary = "Get artists filtered by {query}"
  */

  // TODO: req has spotifyauthorization header
  const token = req.headers.spotifyauthorization
  // TODO: query validation
  const query = req.params.query

  const spotifyResponse = await spotifyAPI.artists(token, query)
  return res.status(spotifyResponse.status).json(await spotifyResponse.json())
})

/**
 * Search tracks filtered by @param query
 * @param {string} query to filter tracks
 * @requires spotifyauthorization header (Bearer token)
 * @returns {Response}
 */
spotifyRouter.get("/tracks/:query", async (req, res) => {
  /*
    #swagger.tags = ["Spotify"]
    #swagger.summary = "Get tracks filtered by {query}"
  */

  // TODO: req has spotifyauthorization header
  const token = req.headers.spotifyauthorization
  // TODO: query validation
  const query = req.params.query

  const spotifyResponse = await spotifyAPI.tracks(token, query)
  return res.status(spotifyResponse.status).json(await spotifyResponse.json())
})

/**
 * Search albums, artists or tracks filtered by @param query
 * @param {string} query to filter albums, artists or tracks
 * @requires spotifyauthorization header (Bearer token)
 * @returns {Response}
 */
spotifyRouter.get("/all/:query", async (req, res) => {
  /*
    #swagger.tags = ["Spotify"]
    #swagger.summary = "Get albums, artists, tracks filtered by {query}"
  */

  // TODO: req has spotifyauthorization header
  const token = req.headers.spotifyauthorization
  // TODO: query validation
  const query = req.params.query

  const spotifyResponse = await spotifyAPI.all(token, query)
  return res.status(spotifyResponse.status).json(await spotifyResponse.json())
})

export default spotifyRouter
