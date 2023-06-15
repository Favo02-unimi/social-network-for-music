import type Playlist from "./Playlist"

interface User {
  _id : string,
  username : string,
  email : string,
  favouriteArtists : string[] // TODO artists type
  favouriteGenres : string[],
  playlists : Playlist[]
}

export default User
