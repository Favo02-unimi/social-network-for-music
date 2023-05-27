import express from "express"
import fetchToken from "../utils/spotifyToken.js"

const spotifyRouter = express.Router()

spotifyRouter.get("/token", async (req, res) => {

  const spotifyResponse = await fetchToken()

  const status = spotifyResponse.status
  const body = await spotifyResponse.json()

  return res.status(status).json(body)
})

export default spotifyRouter
