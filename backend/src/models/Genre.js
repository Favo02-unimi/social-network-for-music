import mongoose from "mongoose"

const genreSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    }
  },
  { collection: "genres" }
)

genreSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  }
})

const Genre = mongoose.model("Genre", genreSchema)

export default Genre
