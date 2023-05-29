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

export default usersRouter
