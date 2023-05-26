import logger from "../utils/logger.js"

// logs every request to the api
const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method)
  logger.info("Path:  ", req.path)

  // sanitize request body (password, tokens)
  var sanitizedBody = structuredClone(req.body)

  if (sanitizedBody.password) {
    sanitizedBody.password = "****"
  }

  if (sanitizedBody.token) {
    sanitizedBody.token = "****"
  }

  logger.info("Body:  ", sanitizedBody)

  logger.info("---")
  next()
}

export default requestLogger
