/* eslint-disable camelcase */
import { z } from "zod"
import validate from "./validate.js"
import regex from "../utils/regex.js"

const CreatePlaylistSchema = z.object({
  title: z.string().regex(regex.title, { message: regex.titleDesc }),
  description: z.string().regex(regex.description, { message: regex.descriptionDesc }),
  tags: z.array(z.string().regex(regex.tag, { message: regex.tagDesc })).default([]),
  isPublic: z.boolean()
})
const validateCreatePlaylist = (input) => validate(CreatePlaylistSchema, input)

const EditPlaylistSchema = z.object({
  title: z.string().regex(regex.title, { message: regex.titleDesc }).optional(),
  description: z.string().regex(regex.description, { message: regex.descriptionDesc }).optional(),
  tags: z.array(z.string().regex(regex.tag, { message: regex.tagDesc })).default([]).optional(),
  isPublic: z.boolean().optional()
})
const validateEditPlaylist = (input) => validate(EditPlaylistSchema, input)

export { validateCreatePlaylist, validateEditPlaylist }
