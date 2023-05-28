import mongoose from "mongoose"
import REGEX from "../utils/regex.js"

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      match: [REGEX.title, `Please fill a valid title: ${REGEX.titleDesc}`]
    },
    description: {
      type: String,
      required: true,
      match: [REGEX.description, `Please fill a valid description: ${REGEX.descriptionDesc}`]
    },
    tags: {
      type: [{
        type: String,
        match: [REGEX.tag, `Please fill a valid tag: ${REGEX.tagDesc}`]
      }],
      required: false,
      default: []
    },
    isPublic: {
      type: Boolean,
      required: true
    },
    tracks: { // TODO: check tracks type, add validation (match)
      type: [String],
      required: false,
      default: []
    },
    followers: { // TODO: check reference is working
      type: [{
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User"
        },
        username: {
          type: String,
          required: true,
          match: [REGEX.username, `Please fill a valid username: ${REGEX.usernameDesc}`]
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
  { collection: "playlists" }
)

playlistSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  }
})

const Playlist = mongoose.model("Playlist", playlistSchema)

export default Playlist
