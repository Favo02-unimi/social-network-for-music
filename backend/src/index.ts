import type { Express, Request, Response } from "express"
import express from "express"

const app : Express = express()
const port = 3003

app.get("/", (req : Request, res : Response) => {
  res.send("Social Network for Music")
})

app.listen(port)
