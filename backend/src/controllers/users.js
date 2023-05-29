import bcrypt from "bcrypt"
import express from "express"
import authenticateUser from "../middlewares/authenticateUser.js"
import REGEX from "../utils/regex.js"
import User from "../models/User.js"

const usersRouter = express.Router()

/**
 * Get current user (logged user)
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
usersRouter.get("/me", authenticateUser, async (req, res) => {

  const user = await User.find({ _id: req.user.id })
  res.json(user)
})

/**
 * Create new user
 * @param {User} body user to add
 * @returns {Response}
 */
usersRouter.post("/create", async (req, res) => {

  const {
    username,
    password,
    email,
    favouriteArtists,
    favouriteGenres
  } = req.body

  // fields validation
  if (!username || !REGEX.username.test(username)) {
    return res.status(400).json({ error: `Enter a valid username: ${REGEX.usernameDesc}` })
  }
  if (!password || !REGEX.password.test(password)) {
    return res.status(400).json({ error: `Enter a valid password: ${REGEX.passwordDesc}` })
  }
  if (!email || !REGEX.email.test(email)) {
    return res.status(400).json({ error: `Enter a valid email: ${REGEX.emailDesc}` })
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

  // no need to validate favouriteArtists and favouriteGenres:
  //   can be null and undefined (default will be assigned)
  //   can be any type (automatically converted to string array)

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newUser = new User({
    username,
    passwordHash,
    email,
    favouriteArtists,
    favouriteGenres
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

  const user = await User.findById(req.user.id)

  // old password check
  if (!req.body?.oldPassword) {
    return res.status(400).json({ error: "Missing old password" })
  }
  const passwordCorrect = await bcrypt.compare(req.body.oldPassword, user.passwordHash)
  if (!passwordCorrect) {
    return res.status(401).json({ error: "Invalid old password" })
  }

  // username
  if (req.body?.username) {
    const username = req.body.username

    if (!REGEX.username.test(username)) {
      return res.status(400).json({ error: `Enter a valid username: ${REGEX.usernameDesc}` })
    }

    const existingUsername = await User.findOne({ username: new RegExp(`^${username}$`, "i") })
    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken" })
    }

    user.username = username
  }

  // password
  if (req.body?.newPassword) {
    const newPassword = req.body.newPassword

    if (!REGEX.password.test(newPassword)) {
      return res.status(400).json({ error: `Enter a valid new password: ${REGEX.passwordDesc}` })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(newPassword, saltRounds)

    user.passwordHash = passwordHash
  }

  // email
  if (req.body?.email) {
    const email = req.body.email

    if (!REGEX.email.test(email)) {
      return res.status(400).json({ error: `Enter a valid email: ${REGEX.emailDesc}` })
    }

    const existingEmail = await User.findOne({ email: new RegExp(`^${email}$`, "i") })
    if (existingEmail) {
      return res.status(400).json({ error: "Email already used" })
    }

    user.email = email
  }

  // favourites artists
  if (req.body?.favouriteArtists) {
    user.favouriteArtists = req.body.favouriteArtists
  }

  // favourites genres
  if (req.body?.favouriteGenres) {
    user.favouriteGenres = req.body.favouriteGenres
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

  const user = await User.findById(req.user.id)

  // old password check
  if (!req.body?.oldPassword) {
    return res.status(400).json({ error: "Missing old password" })
  }
  const passwordCorrect = await bcrypt.compare(req.body.oldPassword, user.passwordHash)
  if (!passwordCorrect) {
    return res.status(401).json({ error: "Invalid old password" })
  }

  // TODO: delete all user resources (playlists, ...)

  await User.findByIdAndDelete(req.user.id)

  res.status(204).end()
})


export default usersRouter
