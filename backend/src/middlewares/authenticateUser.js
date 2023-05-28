import jwt from "jsonwebtoken"
import config from "../utils/config.js"

/**
 * Verify login (verifying jwt token)
 * @param authorization header (JWT token)
 * @returns {Response}
 */
const authenticateUser = (req, res, next) => {

  if (!req.headers.authorization) {
    return res.status(401).json({ error: "missing token" })
  }

  try {
    const token = req.headers.authorization
    jwt.verify(token, config.SECRET)

    const jwtPayload = jwt.decode(token)
    const user = jwtPayload.id

    req.user = user
  }
  catch (err) {
    return res.status(401).json({ error: "invalid token" })
  }

  next()
}

export default authenticateUser
