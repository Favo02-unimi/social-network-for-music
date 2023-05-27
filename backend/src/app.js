import express from "express"
import "express-async-errors"
import Database from "./db/database.js"

import spotifyRouter from "./controllers/spotify.js"

import unknownEndpoint from "./middlewares/unknownEndpoint.js"
import requestLogger from "./middlewares/requestLogger.js"

const app = express()
const db = new Database()

await db.connect()

app.use(express.json())
app.use(requestLogger)

app.use("/api/spotify", spotifyRouter)

app.use(unknownEndpoint)

export default app
