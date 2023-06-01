import express from "express"
import authenticateUser from "../middlewares/authenticateUser.js"
import Playlist from "../models/Playlist.js"

const playlistsRouter = express.Router()

/**
 * Get details of a single playlist
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
playlistsRouter.get("/:id", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Playlists"]
    #swagger.summary = "Get details of {id} playlist (AUTH required)"
  */

  const playlist = await Playlist.findOneById(req.params.id)

  // if not public check user is creator/collaborator
  if (!playlist.isPublic) {
    const userInFollowers = playlist.followers.find(f => f.id === req.user.id)
    if (!userInFollowers) {
      return res.status(401).json({ error: "Unauthorized" })
    }
    if (!(userInFollowers.isCreator || userInFollowers.isCollaborator)) {
      return res.status(401).json({ error: "Unauthorized" })
    }
  }

  res.json(playlist)
})

/**
 * Get all public playlists metadata
 * @returns {Response}
 */
playlistsRouter.get("/public", async (req, res) => {
  /*
    #swagger.tags = ["Playlists"]
    #swagger.summary = "Get all public playlists metadata"
  */

  const playlists = await Playlist
    .find({ isPublic: true })
    .map(p => ({
      title: p.title,
      description: p.description,
      tags: p.tags,
      tracksNumber: p.tracks.length,
      followersNumber: p.followers.length
    }))

  res.json(playlists)
})

/**
 * Create new playlist
 * @param {Playlist} body playlist to add
 * @returns {Response}
 */
playlistsRouter.post("/", async (request, response) => {

  const {
    title,
    description,
    tags,
    isPublic,
    tracks
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
    tracks: tracks ?? []
    // TODO: add creator as follower
  }

  const newPlaylist = new Playlist(playlist)
  const savedPlaylist = await newPlaylist.save()

  response.status(201).json(savedPlaylist)
})

export default playlistsRouter
