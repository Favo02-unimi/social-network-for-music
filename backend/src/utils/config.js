import dotenv from "dotenv"
import path from "path"
import url from "url"

// defining __filename and __dirname (not available in ES modules)
const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
  path: path.join(__dirname, "../../.env")
})

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const SECRET = process.env.SECRET
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

export default {
  MONGODB_URI,
  PORT,
  SECRET,
  CLIENT_ID,
  CLIENT_SECRET
}
