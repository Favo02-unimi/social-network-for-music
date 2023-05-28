import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import express from "express"
import User from "../models/User.js"

const loginRouter = express.Router()

/**
 * Verify login and generate JWT token
 * @param {string, string} body username and password to login
 * @returns {Response}
 */
loginRouter.post("/", async (req, res) => {

  const {
    username,
    password
  } = req.body

  // TODO: fields validation

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

export default loginRouter
