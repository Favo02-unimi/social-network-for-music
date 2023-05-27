import express from "express"
import Playlist from "../models/Playlist.js"

const playlistsRouter = express.Router()

playlistsRouter.get("/", async (req, res) => {

  const playlists = await Playlist.find()

  res.json(playlists)
})

playlistsRouter.post("/", async (request, response) => {

  const {
    title,
    description,
    tags,
    isPublic,
    songs
  } = request.body

  // TODO: proper fields validation
  if (!title) {
    return response.status(400).json({ error: "Enter a valid title" })
  }
  if (!description) {
    return response.status(400).json({ error: "Enter a valid description" })
  }

  const playlist = {
    title: title,
    description: description,
    tags: tags ?? [],
    isPublic: isPublic ?? false,
    songs: songs ?? []
    // TODO: add creator as follower
  }

  const newPlaylist = new Playlist(playlist)
  const savedPlaylist = await newPlaylist.save()

  response.status(201).json(savedPlaylist)
})

export default playlistsRouter
