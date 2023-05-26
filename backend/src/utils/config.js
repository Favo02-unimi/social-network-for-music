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

export default {
  MONGODB_URI,
  PORT,
  SECRET
}
