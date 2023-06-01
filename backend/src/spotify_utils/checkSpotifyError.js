import LOGGER from "../utils/logger.js"

/**
 * Check for spotify API errors (401 unauthorized, 429 rate limit exceeded)
 * @param {Number} status status code
 * @returns {Object} json error
 */
const checkSpotifyError = (status) => {
  LOGGER.info("checking for spotify api error")

  if (status === 401) {
    LOGGER.info("spotify 401 unauthorized")
    return { "error": "cannot generate spotify api token" }
  }

  if (status === 429) {
    LOGGER.info("spotify 429 rate limit")
    return { "error": "spotify api rate limit exceeded" }
  }

  LOGGER.info("no errors")
  return undefined
}

export default checkSpotifyError
