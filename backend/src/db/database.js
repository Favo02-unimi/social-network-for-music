import mongoose from "mongoose"
import config from "../utils/config.js"
import logger from "../utils/logger.js"

class Database {
  constructor() {
    this.connection = null
    mongoose.set("strictQuery", true)
  }

  async connect() {
    try {
      const connection = await mongoose.connect(config.MONGODB_URI)

      this.connection = connection

      logger.info("connected to MongoDB")
    }
    catch(e) {
      logger.error("error connecting to MongoDB:", e.message)
    }
  }
}

export default Database
