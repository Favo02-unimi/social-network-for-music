import bcrypt from "bcrypt"
import express from "express"
import authenticateUser from "../middlewares/authenticateUser.js"
import User from "../models/User.js"

const usersRouter = express.Router()

/**
 * Get current user (logged user)
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
usersRouter.get("/me", authenticateUser, async (req, res) => {

  const user = await User.find({ _id: req.user })
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

  // TODO: fields validation

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
