import type { FC } from "react"

import placeholderImg from "../../assets/images/playlist-placeholder.webp"
import type Track from "../../interfaces/Track"

const PlaylistImage : FC<{tracks : Track[]}> = ({ tracks }) => {

  // no tracks: placeholder
  if (!tracks || !Array.isArray(tracks) || tracks.length === 0) {
    return (
      <img src={placeholderImg} className="w-40 h-40 rounded-t-md opacity-60 saturate-[0.8]" />
    )
  }

  // only one track: track image
  if (tracks.length === 1) {
    return (
      <img src={tracks[0].album.images[0].url} className="w-40 h-40 rounded-t-md opacity-60 saturate-[0.8]" />
    )
  }

  // 2/3 tracks: first 2 tracks images
  if (tracks.length < 4) {
    return (
      <div className="w-40 h-40 grid grid-rows-1 grid-cols-2 rounded-t-md opacity-60 saturate-[0.8] overflow-hidden">
        <img src={tracks[0].album.images[0].url} className="w-20 h-40 object-cover" />
        <img src={tracks[1].album.images[0].url} className="w-20 h-40 object-cover" />
      </div>
    )
  }

  // 4 or more tracks: first 4 tracks images
  return (
    <div className="w-40 h-40 grid grid-rows-2 grid-cols-2 rounded-l-md opacity-60 saturate-[0.8] overflow-hidden">
      <img src={tracks[0].album.images[0].url} className="w-20 h-20" />
      <img src={tracks[1].album.images[0].url} className="w-20 h-20" />
      <img src={tracks[2].album.images[0].url} className="w-20 h-20" />
      <img src={tracks[3].album.images[0].url} className="w-20 h-20" />
    </div>
  )
}

export default PlaylistImage
