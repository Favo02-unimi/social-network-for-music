/* eslint-disable camelcase */
import { z } from "zod"
import validate from "./validate.js"

const TrackSchema = z.object({
  id: z.string(),
  album: z.object({
    album_type: z.enum(["album", "single", "compilation"]),
    name: z.string(),
    release_date: z.string(),
    images: z.array(z.object({
      height: z.number().positive(),
      width: z.number().positive(),
      url: z.string().url()
    }))
  }),
  artists: z.array(z.object({
    id: z.string(),
    name: z.string(),
    external_urls: z.object({
      spotify: z.string().url()
    })
  })),
  duration_ms: z.number().positive(),
  explicit: z.boolean(),
  external_urls: z.object({
    spotify: z.string().url()
  }),
  name: z.string(),
  popularity: z.number().nonnegative(),
  preview_url: z.string().url().nullable()
})
const validateTrack = (input) => validate(TrackSchema, input)

export { validateTrack }
