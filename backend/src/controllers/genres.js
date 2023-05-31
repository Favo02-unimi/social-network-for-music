import express from "express"
import genresJson from "../utils/genres.json" assert { type: "json"}

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

  const exactMatch = genresJson.filter(g => new RegExp(`^${req.params.query}$`, "i").test(g.title))
  const likeMatch = genresJson.filter(g => new RegExp(`${req.params.query}`, "i").test(g.title))

  // join exact and like match ignoring duplicates
  const genres = exactMatch.concat(
    likeMatch.filter(gl => !exactMatch.find(ge => gl.title === ge.title))
  )

  res.json(genres)
})

export default genresRouter
