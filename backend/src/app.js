import express from "express"
import "express-async-errors"
import Database from "./db/database.js"

// controllers imports

import unknownEndpoint from "./middlewares/unknownEndpoint.js"
import requestLogger from "./middlewares/requestLogger.js"

const app = express()
const db = new Database()

await db.connect()

app.use(express.json())
app.use(requestLogger)

// paths use

app.use(unknownEndpoint)

export default app
