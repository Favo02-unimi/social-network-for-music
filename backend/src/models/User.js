import mongoose from "mongoose"
import REGEX from "../utils/regex.js"

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      match: [REGEX.username, `Please fill a valid username: ${REGEX.usernameDesc}`]
    },
    passwordHash: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      match: [REGEX.email, `Please fill a valid username: ${REGEX.emailDesc}`]
    },
    favouriteArtists: {
      type: [{
        id: {
          type: String,
          required: true
        },
        name: {
          type: String,
          required: true
        }
      }],
      required: false,
      default: []
    },
    favouriteGenres: {
      type: [String],
      required: false,
      default: []
    },
    playlists: {
      type: [{
        id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Playlist"
        },
        isCreator: {
          type: Boolean,
          required: false,
          default: false
        },
        isCollaborator: {
          type: Boolean,
          required: false,
          default: false
        }
      }],
      required: false,
      default: []
    }
  },
  { collection: "users" }
)

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model("User", userSchema)

export default User
