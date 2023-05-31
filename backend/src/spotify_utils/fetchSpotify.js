/**
 * Fetch from URL adding the authorization, returning a promise
 * @param {string} URL full URL (base + params) to fetch from
 * @param {string} token authorization token (without "Bearer")
 * @returns {Promise}
 */
const authorizedFetch = async (URL, token) => (
  await fetch(URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
)

const BASE_URL = "https://api.spotify.com/v1/search"

/**
 * Search albums from spotify API, returning a promise
 * @param {string} token authorization token (without "Bearer")
 * @param {string} query used to filter albums
 * @returns {Promise}
 */
const albums = async (token, query) => {
  const URL = `${BASE_URL}?q=${query}&type=album`
  return await authorizedFetch(URL, token)
}

/**
 * Search artists from spotify API, returning a promise
 * @param {string} token authorization token (without "Bearer")
 * @param {string} query used to filter artists
 * @returns {Promise}
 */
const artists = async (token, query) => {
  const URL = `${BASE_URL}?q=${query}&type=artist`
  return await authorizedFetch(URL, token)
}

/**
 * Search tracks from spotify API, returning a promise
 * @param {string} token authorization token (without "Bearer")
 * @param {string} query used to filter tracks
 * @returns {Promise}
 */
const tracks = async (token, query) => {
  const URL = `${BASE_URL}?q=${query}&type=track`
  return await authorizedFetch(URL, token)
}

/**
 * Search albums, artists or tracks from spotify API, returning a promise
 * @param {string} token authorization token (without "Bearer")
 * @param {string} query used to filter albums, artists or tracks
 * @returns {Promise}
 */
const all = async (token, query) => {
  const URL = `${BASE_URL}?q=${query}&type=album,artist,track`
  return await authorizedFetch(URL, token)
}

export default {
  all,
  albums,
  artists,
  tracks
}
