import type { FC } from "react"

import placeholderImg from "../../assets/images/playlist-placeholder.webp"
import type Track from "../../interfaces/Track"

const PlaylistImage : FC<{tracks : Track[], customClasses : string}> = ({ tracks, customClasses: customClasses }) => {

  // no tracks: placeholder
  if (!tracks || !Array.isArray(tracks) || tracks.length === 0) {
    return (
      <img src={placeholderImg} className={`${customClasses} opacity-60 saturate-[0.8]`} />
    )
  }

  // only one track: track image
  if (tracks.length === 1) {
    return (
      <img src={tracks[0].album.images[0].url} className={`${customClasses} opacity-60 saturate-[0.8]`} />
    )
  }

  // 2/3 tracks: first 2 tracks images
  if (tracks.length < 4) {
    return (
      <div className={`${customClasses} grid grid-rows-1 grid-cols-2 opacity-60 saturate-[0.8] overflow-hidden`}>
        <img src={tracks[0].album.images[0].url} className="h-full object-cover" />
        <img src={tracks[1].album.images[0].url} className="h-full object-cover" />
      </div>
    )
  }

  // 4 or more tracks: first 4 tracks images
  return (
    <div className={`${customClasses} grid grid-rows-2 grid-cols-2 opacity-60 saturate-[0.8] overflow-hidden`}>
      <img src={tracks[0].album.images[0].url} />
      <img src={tracks[1].album.images[0].url} />
      <img src={tracks[2].album.images[0].url} />
      <img src={tracks[3].album.images[0].url} />
    </div>
  )
}

export default PlaylistImage
