import bcrypt from "bcrypt"
import express from "express"
import authenticateUser from "../middlewares/authenticateUser.js"
import User from "../models/User.js"
import { validateCreateUser, validateDeleteUser, validateEditUser } from "../validations/User.js"

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

  const user = await User.find({ _id: req.user.id })
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
    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken" })
    }

    user.username = username
  }

  if (newPassword) {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(newPassword, saltRounds)

    user.passwordHash = passwordHash
  }

  if (email) {
    const existingEmail = await User.findOne({ email: new RegExp(`^${email}$`, "i") })
    if (existingEmail) {
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

  // TODO: delete all user resources (playlists, ...)

  await User.findByIdAndDelete(req.user.id)

  res.status(204).end()
})


export default usersRouter
