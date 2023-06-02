import express from "express"
import "express-async-errors"
import path from "path"
import url from "url"

// swagger imports
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./utils/swagger.json" assert { type: "json" }

// database imports
import Database from "./db/database.js"

// controllers imports
import usersRouter from "./controllers/users.js"
import loginRouter from "./controllers/login.js"
import spotifyRouter from "./controllers/spotify.js"
import playlistsRouter from "./controllers/playlists.js"
import genresRouter from "./controllers/genres.js"

// middlewares / utils imports
import unknownEndpoint from "./middlewares/unknownEndpoint.js"
import requestLogger from "./middlewares/requestLogger.js"

const app = express()

// connect to db
const db = new Database()
await db.connect()

// util middlewares
app.use(express.json())
app.use(requestLogger)

// swagger
app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// api endpoints
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)

app.use("/api/spotify", spotifyRouter)
app.use("/api/playlists", playlistsRouter)
app.use("/api/genres", genresRouter)

app.use("/api/*", unknownEndpoint)

// frontend
const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, "/../build")))
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname + "/../build/index.html"))
})

export default app
