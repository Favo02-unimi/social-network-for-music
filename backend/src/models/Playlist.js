/* eslint-disable camelcase */
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
    tracks: [{
      type: {
        id: {
          type: String,
          required: true
        },
        album: {
          album_type: {
            type: String,
            required: true
          },
          name: {
            type: String,
            required: true
          },
          release_date: {
            type: String,
            required: true
          },
          images: [{
            height: {
              type: Number,
              required: true
            },
            width: {
              type: Number,
              required: true
            },
            url: {
              type: String,
              required: true
            }
          }]
        },
        artists: [{
          id: {
            type: String,
            required: true
          },
          name: {
            type: String,
            required: true
          },
          external_urls: {
            spotify: {
              type: String,
              required: true
            }
          }
        }],
        duration_ms: {
          type: Number,
          required: true
        },
        explicit: {
          type: Boolean,
          required: true
        },
        external_urls: {
          spotify: {
            type: String,
            required: true
          }
        },
        name: {
          type: String,
          required: true
        },
        popularity: {
          type: Number,
          required: true
        },
        preview_url: {
          type: String,
          required: false
        }
      },
      required: false,
      default: []
    }],
    creator: {
      type: String,
      required: true,
      match: [REGEX.username, `Please fill a creator username: ${REGEX.usernameDesc}`]
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
