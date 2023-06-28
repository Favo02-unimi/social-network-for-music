import bcrypt from "bcrypt"
import express from "express"
import authenticateUser from "../middlewares/authenticateUser.js"
import User from "../models/User.js"
import Playlist from "../models/Playlist.js"
import { validateCreateUser, validateDeleteUser, validateEditUser, validateUserArtists, validateUserGenres } from "../validations/User.js"

const usersRouter = express.Router()

/**
 * Get current user (logged user)
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
usersRouter.get("/me", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Users"]
    #swagger.summary = "Get current logged user (AUTH required)"
  */

  const user = await User.findById(req.user.id)
  res.json(user)
})

/**
 * Create new user
 * @param {User} body user to add
 * @returns {Response}
 */
usersRouter.post("/create", async (req, res) => {
  /*
    #swagger.tags = ["Users"]
    #swagger.summary = "Create new user"
  */

  const {
    username,
    password,
    email
  } = req.body

  // validate
  const { valid, message } = validateCreateUser({ username, password, email })
  if (!valid) {
    return res.status(400).json({ error: `Invalid user${message}` })
  }

  // unique username and email check
  const existingUsername = await User.findOne({ username: new RegExp(`^${username}$`, "i") })
  if (existingUsername) {
    return res.status(400).json({ error: "Username already taken" })
  }
  const existingEmail = await User.findOne({ email: new RegExp(`^${email}$`, "i") })
  if (existingEmail) {
    return res.status(400).json({ error: "Email already used" })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newUser = new User({
    username,
    passwordHash,
    email
  })

  const savedUser = await newUser.save()
  res.status(201).json(savedUser)
})

/**
 * Edit current user (logged user)
 * @param {User} body fields of the user to edit
 * @requires authorization header (JWT token)
 * @requires oldPassword in body to successfully update user
 * @returns {Response}
 */
usersRouter.patch("/edit", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Users"]
    #swagger.summary = "Edit current logged user (AUTH required)"
  */

  const user = await User.findById(req.user.id)

  const {
    oldPassword,
    username,
    newPassword,
    email
  } = req.body

  // validate
  const { valid, message } = validateEditUser({ oldPassword, username, newPassword, email })
  if (!valid) {
    return res.status(400).json({ error: `Invalid user${message}` })
  }

  // old password check
  const passwordCorrect = await bcrypt.compare(oldPassword, user.passwordHash)
  if (!passwordCorrect) {
    return res.status(401).json({ error: "Invalid old password" })
  }

  // update fields only if not undefined

  if (username) {
    const existingUsername = await User.findOne({ username: new RegExp(`^${username}$`, "i") })
    if (existingUsername && existingUsername._id.toString() !== req.user.id) {
      return res.status(400).json({ error: "Username already taken" })
    }

    user.username = username

    // update all playlists user is creator
    user.playlists
      .filter(p => p.isCreator)
      .forEach(async playlist => {
        const pl = await Playlist.findById(playlist.id)
        pl.creator = username
        await pl.save()
      })
  }

  if (newPassword) {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(newPassword, saltRounds)

    user.passwordHash = passwordHash
  }

  if (email) {
    const existingEmail = await User.findOne({ email: new RegExp(`^${email}$`, "i") })
    if (existingEmail && existingEmail._id.toString() !== req.user.id) {
      return res.status(400).json({ error: "Email already used" })
    }

    user.email = email
  }

  const updatedUser = await user.save()
  res.status(200).json(updatedUser)
})

/**
 * Delete current user (logged user)
 * @requires authorization header (JWT token)
 * @requires oldPassword in body to successfully delete user
 * @returns {Response}
 */
usersRouter.delete("/delete", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Users"]
    #swagger.summary = "Delete current logged user (AUTH required)"
  */

  const { oldPassword } = req.body

  const user = await User.findById(req.user.id)

  // validate
  const { valid, message } = validateDeleteUser({ oldPassword })
  if (!valid) {
    return res.status(400).json({ error: `Invalid user${message}` })
  }

  const passwordCorrect = await bcrypt.compare(oldPassword, user.passwordHash)
  if (!passwordCorrect) {
    return res.status(401).json({ error: "Invalid old password" })
  }

  // delete all user resources (delete creator playlists, unfollow playlists)
  user.playlists.forEach(async playlist => {

    // creator: delete playlist
    if (playlist.isCreator) {

      // update all followers
      const followers = await User.find({ playlists: { $elemMatch: { id: playlist.id } } })
      followers.forEach(async f => {
        f.playlists = f.playlists.filter(p => p.id.toString() !== playlist.id.toString())
        await f.save()
      })

      // delete playlist
      await Playlist.findByIdAndDelete(playlist.id)
    }

    // collaborator/follower: unfollow
    else {
      const p = await Playlist.findById(playlist.id)
      p.followers = p.followers.filter(f => f.userId.toString() !== user._id.toString())
      await p.save()
    }

  })

  await User.findByIdAndDelete(req.user.id)

  res.status(204).end()
})

/**
 * Edit current user favourite artists
 * @param {Artist[]} favourites artists
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
usersRouter.patch("/artists", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Users"]
    #swagger.summary = "Edit favourite artist (AUTH required)"
  */

  const {
    artists
  } = req.body

  // validate
  const { valid, message } = validateUserArtists(artists)
  if (!valid) {
    return res.status(400).json({ error: `Invalid artists${message}` })
  }

  // check duplicates
  const uniqueArtists = new Set(artists.map(a => a.id))
  if (uniqueArtists.size !== artists.length) {
    return res.status(400).json({ error: "Duplicated artist" })
  }

  const user = await User.findById(req.user.id)

  user.favouriteArtists = artists

  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

/**
 * Edit current user favourite genres
 * @param {string[]} favourites genres
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
usersRouter.patch("/genres", authenticateUser, async (req, res) => {
  /*
    #swagger.tags = ["Users"]
    #swagger.summary = "Edit favourite genres (AUTH required)"
  */

  const {
    genres
  } = req.body

  // validate
  const { valid, message } = validateUserGenres(genres)
  if (!valid) {
    return res.status(400).json({ error: `Invalid genres${message}` })
  }

  // check duplicates
  const uniqueGenres = new Set(genres)
  if (uniqueGenres.size !== genres.length) {
    return res.status(400).json({ error: "Duplicated genre" })
  }

  const user = await User.findById(req.user.id)

  user.favouriteGenres = genres

  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

export default usersRouter
