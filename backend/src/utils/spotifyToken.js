import config from "./config.js"

const URL = "https://accounts.spotify.com/api/token"

const fetchToken = async () => {

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({ "grant_type": "client_credentials" })
  })

  return res
}

export default fetchToken
