import LOGGER from "../utils/logger.js"
import config from "../utils/config.js"

const URL = "https://accounts.spotify.com/api/token"

/**
 * Generate a new Spotify API token
 * @requires .env CLIENT_ID and CLIENT_SECRET
 * @returns {String} token
 */
const generateSpotifyToken = async (app) => {

  LOGGER.info("generating/refreshing spotify token")

  const basicAuth = new Buffer.from(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`).toString("base64")

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  })

  const { access_token: token } = await res.json()

  // set spotifyToken in app.locals variable
  app.locals.spotifyToken = token

  return token
}

export default generateSpotifyToken
