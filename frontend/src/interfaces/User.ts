import type Artist from "./Artist"
import type Playlist from "./Playlist"

interface User {
  _id : string,
  username : string,
  email : string,
  favouriteArtists : Artist[]
  favouriteGenres : string[],
  playlists : Playlist[]
}

export default User
