import bcrypt from "bcrypt"
import express from "express"
import User from "../models/User.js"

const usersRouter = express.Router()

/**
 * Get all users
 * @returns {Response}
 */
usersRouter.get("/all", async (req, res) => {

  const users = await User.find()
  res.json(users)
})

/**
 * Create new user
 * @param {User} body user to add
 * @returns {Response}
 */
usersRouter.post("/", async (req, res) => {

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
