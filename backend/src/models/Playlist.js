import mongoose from "mongoose"

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    tags: {
      type: [String],
      required: false,
      default: []
    },
    isPublic: {
      type: Boolean,
      required: true
    },
    songs: { // TODO: check songs type
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
