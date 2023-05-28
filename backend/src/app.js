import express from "express"
import "express-async-errors"
import Database from "./db/database.js"

import usersRouter from "./controllers/users.js"
import loginRouter from "./controllers/login.js"

import spotifyRouter from "./controllers/spotify.js"
import playlistsRouter from "./controllers/playlists.js"
import genresRouter from "./controllers/genres.js"

import unknownEndpoint from "./middlewares/unknownEndpoint.js"
import requestLogger from "./middlewares/requestLogger.js"

const app = express()
const db = new Database()

await db.connect()

app.use(express.json())
app.use(requestLogger)

app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)

app.use("/api/spotify", spotifyRouter)
app.use("/api/playlists", playlistsRouter)
app.use("/api/genres", genresRouter)

app.use(unknownEndpoint)

export default app
