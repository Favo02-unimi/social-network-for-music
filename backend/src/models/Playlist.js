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
    tracks: { // TODO: validate tracks Object
      type: [Object],
      required: false,
      default: []
    },
    followers: {
      type: [{
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User"
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
      required: true
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
