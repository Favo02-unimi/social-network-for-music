import type { FC } from "react"
import { useState } from "react"
import { confirmAlert } from "react-confirm-alert"
import { BiAlbum } from "react-icons/bi"
import { FiClock } from "react-icons/fi"
import { ImBin2 } from "react-icons/im"
import { MdPlayDisabled, MdPlaylistAdd } from "react-icons/md"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import placeholderImg from "../../assets/images/playlist-placeholder.webp"
import type Playlist from "../../interfaces/Playlist"
import type Track from "../../interfaces/Track"
import playlistsService from "../../services/playlists"
import checkTokenExpiration from "../../utils/checkTokenExpiration"
import parseTime from "../../utils/parseTime"
import PlayPreview from "../Explore/PlayPreview"
import Loading from "../Loading"

import AddToPlaylist from "./AddToPlaylist"

const TrackRow : FC<{
  track : Track,
  playlist : Playlist,
  setPlaylist : (p : Playlist) => void
}> = ({ track, playlist, setPlaylist }) => {

  const navigate = useNavigate()

  const [showAddToPlaylist, setShowAddToPlaylist] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleRemoveFromPlaylist = () => {
    confirmAlert({
      title: "Confirm deletion",
      message: `Are you sure to remove "${track.name}" from playlist ${playlist.title}?`,
      buttons: [
        {
          label: "Cancel"
        },
        {
          label: "Remove",
          className: "remove",
          onClick: removeFromPlaylist
        }
      ]
    })
  }

  const removeFromPlaylist = async () => {

    setIsLoading(true)

    try {
      const { valid, message } = checkTokenExpiration()
      if (!valid) {
        toast.error(message)
        navigate("/login",  { replace: true })
        return
      }

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
    <div className="w-full my-2 mb-4 h-full md:h-16 flex flex-col md:flex-row items-center transition-all duration-700 border-t pt-4 md:pt-0 border-white/30 md:border-t-0">

      <div className="w-full md:w-1/2 flex flex-row items-center">
        {track.preview_url
          ? <PlayPreview url={track.preview_url} customClasses="mr-3 w-10 text-center hover:border-spotify-greendark border-transparent" />
          : <MdPlayDisabled title="Preview unavailable" className="inline w-10 text-2xl mr-3 text-white/20" />
        }

        <img src={track.album.images[0]?.url ?? placeholderImg} className="w-16 h-16 opacity-80" />

        <div className="w-full flex flex-col items-center px-2">
          <h1 className="w-full font-bold text-ellipsis whitespace-nowrap overflow-hidden">{track.name}</h1>

          <div className="w-full overflow-hidden">
            {track.explicit && <h2 title="Explicit" className="inline text-red-700 text-xs uppercase border border-red-700 px-1 pb-0.5 rounded opacity-70 mr-1">E</h2>}
            {track.artists.map((a, i) =>
              <Link to="/explore/tracks" state={{ redirectArtist: a.name }} key={a.id}>
                <h2
                  className="cursor-pointer hover:underline inline uppercase text-sm text-ellipsis whitespace-nowrap overflow-hidden"
                >
                  {a.name}{i < track.artists.length - 1 ? ", " : ""}
                </h2>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="md:w-1/2 relative flex flex-row items-center mt-4">
        <div className="w-full flex flex-col items-center px-2">
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
                customClasses="absolute !w-52 md:!w-96 top-1/2 -translate-y-1/2 right-full backdrop-blur text-center"
              />
            }
            <MdPlaylistAdd
              title="Add to other playlist"
              onClick={() => setShowAddToPlaylist(!showAddToPlaylist)}
              className="text-2xl text-white/70 hover:text-white cursor-pointer"
            />
          </div>

          {(playlist.isCreator || playlist.isCollaborator) &&
            <ImBin2
              title="Remove from playlist"
              onClick={handleRemoveFromPlaylist}
              className="text-lg text-red-700/70 hover:text-red-700 cursor-pointer"
            />
          }
        </div>
      </div>
    </div>
  )
}

export default TrackRow
