import LOGGER from "../utils/logger.js"
import jwt from "jsonwebtoken"
import config from "../utils/config.js"

/**
 * Verify login (verifying jwt token)
 * @param authorization header (JWT token)
 * @returns {Response}
 */
const authenticateUser = (req, res, next) => {

  LOGGER.info("authenticating user...")

  if (!req.headers.authorization) {
    LOGGER.info("authentication failed")
    return res.status(401).json({ error: "missing token" })
  }

  try {
    const token = req.headers.authorization
    jwt.verify(token, config.SECRET)

    const jwtPayload = jwt.decode(token)

    req.user = {
      username: jwtPayload.username,
      id: jwtPayload.id
    }
  }
  catch (err) {
    LOGGER.info("authentication failed")
    return res.status(401).json({ error: "invalid token" })
  }

  LOGGER.info("authentication successfull")
  next()
}

export default authenticateUser
