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
    songs: { // TODO: check songs type, add validation (match)
      type: [String],
      required: false,
      default: []
    },
    followers: { // TODO: check reference is working
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: false,
      default: []
    }
  },
  { collection: "playlists" }
)

playlistSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const Playlist = mongoose.model("Playlist", playlistSchema)

export default Playlist
