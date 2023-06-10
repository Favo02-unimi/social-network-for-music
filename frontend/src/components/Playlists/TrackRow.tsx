import type { FC } from "react"
import { useState } from "react"
import { BiAlbum } from "react-icons/bi"
import { FiClock } from "react-icons/fi"
import { ImBin2 } from "react-icons/im"
import { MdPlaylistAdd } from "react-icons/md"
import { toast } from "react-toastify"

import type Playlist from "../../interfaces/Playlist"
import type Track from "../../interfaces/Track"
import playlistsService from "../../services/playlists"
import parseTime from "../../utils/parseTime"
import PlayPreview from "../Explore/PlayPreview"
import Loading from "../Loading"

import AddToPlaylist from "./AddToPlaylist"

const TrackRow : FC<{
  track : Track,
  playlist : Playlist,
  setPlaylist : (p : Playlist) => void
}> = ({ track, playlist, setPlaylist }) => {

  const [showAddToPlaylist, setShowAddToPlaylist] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleRemoveFromPlaylist = async () => {

    setIsLoading(true)

    try {
      const addedPlaylist = await playlistsService.removeTrack(playlist._id, track.id)

      setPlaylist({
        ...addedPlaylist,
        isCreator: playlist.isCreator,
        isCollaborator: playlist.isCollaborator,
        isFollower: playlist.isFollower
      })

      toast.success(`Removed from playlist ${addedPlaylist.title} successfully.`)
    }
    catch(e) {
      if (e?.response?.data?.error) {
        toast.error(e.response.data.error)
      } else {
        toast.error("Generic error, please try again")
      }
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full my-2 mb-4 h-16 flex flex-row items-center transition-all duration-700">

      {track.preview_url
        ? <PlayPreview url={track.preview_url} customClasses="mr-3 w-10 text-center hover:border-spotify-greendark border-transparent" />
        : <div className="w-10 mr-3" />
      }

      <img src={track.album.images[0].url} className="w-16 h-16 opacity-80" />

      <div className="w-2/4 flex flex-col items-center px-2">
        <h1 className="w-full font-bold text-ellipsis whitespace-nowrap overflow-hidden">{track.name}</h1>

        <div className="w-full overflow-hidden">
          {track.explicit && <h2 title="Explicit" className="inline text-red-700 text-xs uppercase border border-red-700 px-1 pb-0.5 rounded opacity-70 mr-1">E</h2>}
          {track.artists.map((a, i) =>
            <h2 className="inline uppercase text-sm text-ellipsis whitespace-nowrap overflow-hidden" key={a.id}>
              {a.name}{i < track.artists.length - 1 ? ", " : ""}
            </h2>
          )}
        </div>
      </div>

      <div className="w-2/4 flex flex-col items-center px-2">
        <h2><BiAlbum className="inline -mt-1 mr-1" />{track.album.name}</h2>
        <h2 className="text-white/60"><FiClock className="inline -mt-1 mr-1" />{parseTime.parseDuration(track.duration_ms).minutes}:{parseTime.parseDuration(track.duration_ms).seconds}</h2>
      </div>


      <div className="relative h-full w-1/4 flex justify-center items-center gap-2">
        {isLoading && <Loading small />}

        <div className="relative h-full flex justify-center items-center">
          {showAddToPlaylist &&
            <AddToPlaylist
              track={track}
              customClose={() => setShowAddToPlaylist(false)}
              customClasses="absolute w-96 top-1/2 -translate-y-1/2 right-full backdrop-blur text-center"
            />
          }
          <MdPlaylistAdd
            onClick={() => setShowAddToPlaylist(!showAddToPlaylist)}
            className="text-2xl text-white/70 hover:text-white cursor-pointer"
          />
        </div>

        <ImBin2
          onClick={handleRemoveFromPlaylist}
          className="text-lg text-red-700/70 hover:text-red-700 cursor-pointer"
        />
      </div>
    </div>
  )
}

export default TrackRow
