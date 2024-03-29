import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import express from "express"
import User from "../models/User.js"
import authenticateUser from "../middlewares/authenticateUser.js"
import { validateLoginUser } from "../validations/User.js"

const loginRouter = express.Router()

/**
 * Verify login and generate JWT token
 * @param {string, string} body username and password to login
 * @returns {Response}
 */
loginRouter.post("/", async (req, res) => {
  /*
    #swagger.tags = ["Login"]
    #swagger.summary = "Login an existing user (generate JWT token)"
  */

  const { username, password } = req.body

  // validate
  const { valid, message } = validateLoginUser({ username, password })
  if (!valid) {
    return res.status(400).json({ error: `Invalid user${message}` })
  }

  // username check
  const user = await User.findOne({ username })
  if (!user) {
    return res.status(401).json({ error: "invalid username" })
  }

  // password check
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
  if (!passwordCorrect) {
    return res.status(401).json({ error: "invalid password" })
  }

  const token = jwt.sign(
    { username: user.username, id: user._id },
    process.env.SECRET,
    { expiresIn: "1h" }
  )

  return res
    .status(200)
    .json({
      token,
      expires: new Date(Date.now() + 1 * 3600000),
      username: user.username,
      id: user._id
    })
})

/**
 * Verify login
 * @requires authorization header (JWT token)
 * @returns {Response}
 */
loginRouter.get("/verify", authenticateUser, async (req, res) => (
  /*
    #swagger.tags = ["Login"]
    #swagger.summary = "Verify login verifying JWT token"
  */

  res.status(200).json({ body: "valid token" })
))

export default loginRouter
