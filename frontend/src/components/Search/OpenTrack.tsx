import type { FC } from "react"
import { BsSpotify } from "react-icons/bs"
import { IoCloseSharp } from "react-icons/io5"
import { Link } from "react-router-dom"

import type Track from "../../interfaces/Track"

import PlayPreview from "./PlayPreview"

const OpenTrack : FC<{
  track : Track,
  setOpenTrack : ((t ?: Track) => void)
}> = ({ track, setOpenTrack }) => {

  const parseRelease = (dateString : string) => {
    const date = new Date(dateString)
    return date.getFullYear()
  }

  const parseDuration = (durationMs : number) => {
    const minutes = Math.floor(durationMs / 60000)
    const seconds = Math.floor((durationMs % 60000) / 1000).toString().padStart(2, "0")
    return { minutes, seconds }
  }

  return (
    <div className=" -skew-y-2 relative p-4 text-center ml-2 w-1/3 h-full border-l-2 border-white/20 flex flex-col justify-center items-center">
      <IoCloseSharp
        onClick={() => setOpenTrack(undefined)}
        className="absolute top-2 right-2 h-6 w-6"
      />

      <img src={track.album.images[0].url} className="w-72 h-72 rounded-md" />

      <h1 className="my-4 text-2xl font-bold">{track.name}</h1>

      <div className="text-center bg-spotify-greendark rounded-md font-bold px-4 py-1">
        {track.artists.map((a, i) =>
          <h2 className="uppercase px-2 text-ellipsis whitespace-nowrap overflow-hidden" key={a.id}>
            {a.name}{i < track.artists.length - 1 ? ", " : ""}
          </h2>
        )}
      </div>

      <h3 className="mt-4"><span className="uppercase font-bold text-white/40 text-xs">From</span> {track.album.name}</h3>
      <h3 className="mt-4 uppercase font-bold text-white/60 text-sm">
        {parseRelease(track.album.release_date)} - {parseDuration(track.duration_ms).minutes}:{parseDuration(track.duration_ms).seconds}
      </h3>

      <Link to={track.external_urls.spotify} target="_blank" className="mt-4">
        <h3 className="mr-1.5 uppercase text-spotify-greendark font-bold hover:underline">
          Open in Spotify <BsSpotify className="inline -mt-0.5" />
        </h3>
      </Link>

      <PlayPreview url={track.preview_url} />
    </div>
  )
}

export default OpenTrack
