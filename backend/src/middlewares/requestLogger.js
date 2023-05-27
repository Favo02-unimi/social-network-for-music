import logger from "../utils/logger.js"

// logs every request to the api
const requestLogger = (req, res, next) => {
  logger.info("---")
  logger.info("Method:", req.method)
  logger.info("Path:  ", req.path)
  logger.info("Body:  ", req.body)
  logger.info("Headers:  ", req.headers)
  logger.info("---")
  next()
}

export default requestLogger
