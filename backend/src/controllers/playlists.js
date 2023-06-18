import express from "express"
import mongoose from "mongoose"
import authenticateUser from "../middlewares/authenticateUser.js"
import Playlist from "../models/Playlist.js"
import User from "../models/User.js"
import { validateTrack } from "../validations/Track.js"
import { validateCreatePlaylist, validateEditPlaylist } from "../validations/Playlist.js"

const playlistsRouter = express.Router()

/**
 * Get all public playlists metadata
 * @returns {Response}
 */
playlistsRouter.get("/public", async (req, res) => {
  /*
    #swagger.tags = ["Playlists"]
    #swagger.summary = "Get all public playlists metadata"
  */

  const playlists = await Playlist.find({ isPublic: true })

  res.json(playlists)
})

/**
 * Get all playlists followed, created or collaborated by current user
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
playlistsRouter.get("/", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Playlists"]
    #swagger.summary = "Get all playlists followed, created or collaborated by current user (AUTH required)"
  */

  const user = await User.findById(req.user.id).populate("playlists.id")

  // "normalize" population
  const playlists = user.playlists.map(p => ({
    ...p.id._doc,
    isCreator: p.isCreator,
    isCollaborator: p.isCollaborator,
    isFollower: true
  }))

  res.json(playlists)
})


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

  // validate id
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: "Playlist not found" })
  }

  const playlist = await Playlist.findById(req.params.id)

  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" })
  }

  // find current user in playlists follower (must be following if creator/collaborator)
  const userInFollowers = playlist.followers.find(f => f.userId.toString() === req.user.id)

  // check user is creator/collaborator
  let isCreator = false
  let isCollaborator = false
  if (userInFollowers) {
    isCreator = userInFollowers.isCreator
    isCollaborator = userInFollowers.isCollaborator
  }

  // if not public check user is creator/collaborator (authorization)
  if (!playlist.isPublic) {
    if (!(isCreator || isCollaborator)) {
      return res.status(401).json({ error: "Unauthorized" })
    }
  }

  // "normalize" return (adding isCreator, isCollaborator)
  res.json({
    ...playlist._doc,
    isCreator,
    isCollaborator,
    isFollower: userInFollowers
  })
})

/**
 * Create new playlist
 * @param {Playlist} body playlist to add
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
playlistsRouter.post("/create", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Playlists"]
    #swagger.summary = "Create new playlist (AUTH required)"
  */

  const {
    title,
    description,
    tags,
    isPublic
  } = req.body

  // validate
  const { valid, message } = validateCreatePlaylist({ title, description, tags, isPublic })
  if (!valid) {
    return res.status(400).json({ error: `Invalid playlist${message}` })
  }

  const playlist = {
    title,
    description,
    tags,
    isPublic,
    creator: req.user.username,
    followers: [{
      userId: req.user.id,
      isCreator: true
    }]
  }

  const newPlaylist = new Playlist(playlist)
  const savedPlaylist = await newPlaylist.save()

  const user = await User.findById(req.user.id)
  user.playlists.push({ id: newPlaylist._id, isCreator: true })
  await user.save()

  res.status(201).json(savedPlaylist)
})

/**
 * Edit @param id playlist
 * @param {String} id id of playlist to edit
 * @param {User} body fields of the playlist to edit
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
playlistsRouter.patch("/edit/:id", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Playlists"]
    #swagger.summary = "Edit id playlist (AUTH required)"
  */

  // validate id
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: "Playlist not found" })
  }

  const playlist = await Playlist.findById(req.params.id)

  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" })
  }

  // check user is creator/collaborator
  const userInFollowers = playlist.followers.find(f => f.userId.toString() === req.user.id)
  if (!userInFollowers) {
    return res.status(401).json({ error: "You need to be the creator or a collaborator to edit this playlist" })
  }
  if (!(userInFollowers.isCreator || userInFollowers.isCollaborator)) {
    return res.status(401).json({ error: "You need to ne the creator or a collaborator to edit this playlist" })
  }

  const {
    title,
    description,
    tags,
    isPublic
  } = req.body

  // validate
  const { valid, message } = validateEditPlaylist({ title, description, tags, isPublic })
  if (!valid) {
    return res.status(400).json({ error: `Invalid playlist${message}` })
  }

  // update fields only if not undefined

  if (title) {
    playlist.title = title
  }

  if (description) {
    playlist.description = description
  }

  if (tags) {
    playlist.tags = tags
  }

  if("isPublic" in req.body) {
    playlist.isPublic = isPublic
  }

  const updatedPlaylist = await playlist.save()
  res.status(200).json(updatedPlaylist)
})

/**
 * Delete @param id playlist
 * @param {String} id id of playlist to edit
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
playlistsRouter.delete("/delete/:id", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Playlists"]
    #swagger.summary = "Delete id playlist (AUTH required)"
  */

  // validate id
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: "Playlist not found" })
  }

  const playlistId = req.params.id

  const playlist = await Playlist.findById(playlistId)

  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" })
  }

  // check user is creator
  const userInFollowers = playlist.followers.find(f => f.userId.toString() === req.user.id)
  if (!userInFollowers) {
    return res.status(401).json({ error: "You need to be the creator to delete this playlist" })
  }
  if (!(userInFollowers.isCreator)) {
    return res.status(401).json({ error: "You need to be the creator to delete this playlist" })
  }

  // update all followers
  const followers = await User.find({ playlists: { $elemMatch: { id: playlistId } } })

  followers.forEach(async f => {
    f.playlists = f.playlists.filter(p => p.id.toString() !== playlistId)
    await f.save()
  })

  // delete playlist
  await Playlist.findByIdAndDelete(req.params.id)

  res.status(204).end()
})

/**
 * Add track to @param id playlist
 * @param {String} id id of playlist to add track
 * @param {Track} body track to add
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
playlistsRouter.post("/:id/add", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Playlists"]
    #swagger.summary = "Add track to playlist (AUTH required)"
  */

  // validate id
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: "Playlist not found" })
  }

  const playlist = await Playlist.findById(req.params.id)

  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" })
  }

  // check user is creator/collaborator
  const userInFollowers = playlist.followers.find(f => f.userId.toString() === req.user.id)
  if (!userInFollowers) {
    return res.status(401).json({ error: "You need to be the creator or a collaborator to edit this playlist" })
  }
  if (!(userInFollowers.isCreator || userInFollowers.isCollaborator)) {
    return res.status(401).json({ error: "You need to ne the creator or a collaborator to edit this playlist" })
  }

  const { track } = req.body

  // validate
  const { valid, message, parsed } = validateTrack(track)
  if (!valid) {
    return res.status(400).json({ error: `Invalid track${message}` })
  }

  // use parsed as track to insert in db: extra fields removed

  if (playlist.tracks.find(t => t.id === parsed.id)) {
    return res.status(400).json({ error: `Track already in playlist ${playlist.title}` })
  }

  playlist.tracks.push(parsed)
  const savedPlaylist = await playlist.save()

  res.status(200).json(savedPlaylist)
})

/**
 * Remove track from @param id playlist
 * @param {String} id id of playlist to remove track
 * @param {String} body id of track to remove
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
playlistsRouter.delete("/:id/remove/:trackid", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Playlists"]
    #swagger.summary = "Remove track from playlist (AUTH required)"
  */

  // validate id
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: "Playlist not found" })
  }

  const playlist = await Playlist.findById(req.params.id)

  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" })
  }

  // check user is creator/collaborator
  const userInFollowers = playlist.followers.find(f => f.userId.toString() === req.user.id)
  if (!userInFollowers) {
    return res.status(401).json({ error: "You need to be the creator or a collaborator to edit this playlist" })
  }
  if (!(userInFollowers.isCreator || userInFollowers.isCollaborator)) {
    return res.status(401).json({ error: "You need to ne the creator or a collaborator to edit this playlist" })
  }

  const trackId = req.params.trackid

  if (!playlist.tracks.find(t => t.id === trackId)) {
    return res.status(404).json({ error: `Track not found in playlist ${playlist.title}` })
  }

  playlist.tracks = playlist.tracks.filter(t => t.id !== trackId)
  const savedPlaylist = await playlist.save()

  res.status(204).json(savedPlaylist)
})

/**
 * Current user follow @param id playlist
 * @param {String} id id of playlist to follow
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
playlistsRouter.post("/:id/follow", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Playlists"]
    #swagger.summary = Current user follow playlist (AUTH required)"
  */

  // validate id
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: "Playlist not found" })
  }

  const playlist = await Playlist.findById(req.params.id)

  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" })
  }

  const userId = req.user.id

  const userInFollowers = playlist.followers.find(f => f.userId.toString() === userId)
  if (userInFollowers) {
    return res.status(400).json({ error: "Playlist already followed" })
  }

  playlist.followers.push({ userId })
  const savedPlaylist = await playlist.save()

  const user = await User.findById(userId)
  user.playlists.push({ id: savedPlaylist._id })
  await user.save()

  res.status(200).json(savedPlaylist)
})

/**
 * Current user unfollow @param id playlist
 * @param {String} id id of playlist to unfollow
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
playlistsRouter.post("/:id/unfollow", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Playlists"]
    #swagger.summary = Current user unfollow playlist (AUTH required)"
  */

  // validate id
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: "Playlist not found" })
  }

  const playlist = await Playlist.findById(req.params.id)

  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" })
  }

  const userId = req.user.id

  const userInFollowers = playlist.followers.find(f => f.userId.toString() === userId)
  if (!userInFollowers) {
    return res.status(400).json({ error: "Playlist not followed" })
  }

  if (userInFollowers.isCreator) {
    return res.status(400).json({ error: "You are the creator of the playlist, you can't unfollow" })
  }

  playlist.followers = playlist.followers.filter(u => u.userId.toString() !== userId)
  const savedPlaylist = await playlist.save()

  const user = await User.findById(userId)
  user.playlists = user.playlists.filter(p => p.id.toString() !== savedPlaylist._id.toString())
  await user.save()

  res.status(200).json(savedPlaylist)
})

/**
 * Get followers of a playlist
 * @param {String} id id of playlist to get followers
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
playlistsRouter.get("/:id/followers", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Playlists"]
    #swagger.summary = "Get followers of {id} playlist (AUTH required)"
  */

  // validate id
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: "Playlist not found" })
  }

  const playlist = await Playlist.findById(req.params.id).populate("followers.userId", "username")

  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" })
  }

  // find current user in playlists follower (must be following if creator/collaborator)
  const userInFollowers = playlist.followers.find(f => f.userId.toString() === req.user.id)

  // check user is creator/collaborator
  let isCreator = false
  let isCollaborator = false
  if (userInFollowers) {
    isCreator = userInFollowers.isCreator
    isCollaborator = userInFollowers.isCollaborator
  }

  // if not public check user is creator/collaborator (authorization)
  if (!playlist.isPublic) {
    if (!(isCreator || isCollaborator)) {
      return res.status(401).json({ error: "Unauthorized" })
    }
  }

  // "normalize" return (only followers)
  res.json(playlist.followers.map(f => ({
    userId: f.userId._id,
    username: f.userId.username,
    isCreator: f.isCreator,
    isCollaborator: f.isCollaborator
  })))
})

export default playlistsRouter
