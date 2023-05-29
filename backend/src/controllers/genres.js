import express from "express"
import Genre from "../models/Genre.js"

const genresRouter = express.Router()

/**
 * Search genres filtered by @param query
 * @param {string} query to filter genres
 * @returns {Response}
 */
genresRouter.get("/:query", async (req, res) => {
  /*
    #swagger.tags = ["Genres"]
    #swagger.summary = "Get genres filtered by {query}"
  */

  const exact = new RegExp(`^${req.params.query}$`, "i")
  const like = new RegExp(`${req.params.query}`, "i")

  // exact match
  const genresExact = await Genre.find({ title: exact })
  // like match
  const genresLike = await Genre.find({ title: like })

  // join exact and like match ignoring duplicates
  const genres = genresExact.concat(
    genresLike.filter(gl => !genresExact.find(ge => gl.id === ge.id))
  )

  res.json(genres)
})

export default genresRouter
