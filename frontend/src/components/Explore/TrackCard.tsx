import type { FC } from "react"

import playlistImg from "../../assets/images/playlist-placeholder.webp"
import type Track from "../../interfaces/Track"

const TrackCard : FC<{
  track : Track,
  openTrack ?: Track
}> = ({ track, openTrack }) => (

  <div
    className={`${openTrack?.id === track.id ? "bg-white/20 border-spotify-greendark" : ""} -skew-y-2 shrink-0 grow-0 m-4 w-28 md:w-40 pb-2 h-48 md:h-60 flex flex-col items-center border border-white/20 rounded-md text-center hover:bg-white/20 cursor-pointer transition-all duration-700`}>

    <img src={track.album.images[0]?.url ?? playlistImg} className="w-28 h-28 md:w-40 md:h-40 rounded-t-md opacity-80" />

    <h1 className="w-full my-1 px-2 font-bold text-ellipsis whitespace-nowrap overflow-hidden">{track.name}</h1>

    <div className="w-full overflow-hidden">
      {track.artists.map((a, i) =>
        <h2 className="w-full uppercase text-xs px-2 text-ellipsis whitespace-nowrap overflow-hidden" key={a.id}>
          {a.name}{i < track.artists.length - 1 ? ", " : ""}
        </h2>
      )}
    </div>
  </div>

)

export default TrackCard
