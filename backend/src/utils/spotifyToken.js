import config from "./config.js"

const URL = "https://accounts.spotify.com/api/token"

const fetchToken = async () => {

  const basicAuth = new Buffer.from(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`).toString("base64")

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  })

  return res
}

export default fetchToken
