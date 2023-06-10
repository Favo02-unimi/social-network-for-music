import type { FC } from "react"
import { useEffect, useState } from "react"
import { FaLock } from "react-icons/fa"
import { MdPublic } from "react-icons/md"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"

import type PlaylistInterface from "../../interfaces/Playlist"
import playlistsService from "../../services/playlists"
import Loading from "../Loading"

import PlaylistImage from "./PlaylistImage"
import TrackRow from "./TrackRow"

const Playlist : FC = () => {

  const { id } = useParams()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [playlist, setPlaylist] = useState<PlaylistInterface>()

  useEffect(() => {

    const fetchData = async () => {
      setIsLoading(true)

      try {
        const res = await playlistsService.getSingle(id ?? "")

        setPlaylist(res)
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

    fetchData()

  }, [id])

  if (!playlist) {
    return (
      <div className="relative w-full h-full border border-white/20 rounded-md p-6 flex justify-center items-center">
        {isLoading && <Loading small />}
      </div>
    )
  }

  return (
    <div className="relative w-full h-full border border-white/20 rounded-md p-6 flex justify-center items-center">
      {isLoading && <Loading small />}

      <div className="w-1/3 h-full border-r border-white/20 pr-4 flex flex-col justify-center items-center -skew-y-2">

        <PlaylistImage tracks={playlist.tracks} customClasses="h-80 w-80 rounded-md" />

        <h1 className="mt-2 font-bold text-spotify-green text-3xl shrink-0">
          {playlist.title}
          {playlist.isPublic
            ? <MdPublic className="inline text-spotify-greendark text-xl -mt-1 ml-2" />
            : <FaLock className="inline text-spotify-greendark text-xl -mt-1 ml-2" />
          }
        </h1>

        <h2 className="uppercase px-2 text-ellipsis whitespace-nowrap overflow-hidden font-bold text-white/50 shrink-0">
          BY {playlist.creator} - {playlist.followers.length} followers
        </h2>

        <div>
          <h3 className="mt-1 text-xl font-bold">{playlist.tracks.length} tracks</h3>
        </div>

        <div className="mt-2 shrink-0 w-full flex flex-row flex-wrap justify-center">
          {playlist.tags.map(t => <h3 className="bg-gray-500/40 inline m-1 rounded px-2 py-0.5" key={t}>{t}</h3>)}
        </div>

        <div className="mt-4">
          {(playlist.isCreator || playlist.isCollaborator || playlist.isFollower) &&
            <h3 className="mb-2 text-spotify-green font-bold uppercase text-lg px-2 opacity-50 border border-spotify-green rounded-md">
              {playlist.isCollaborator
                ? "collaborator"
                : playlist.isCreator
                  ? "creator"
                  : "follower"
              }
            </h3>
          }

          {/* TODO: add collaborator to playlist */}

          {/* TODO: add edit playlist */}

          {/* TODO: add delete playlist */}
        </div>

      </div>

      <div className="w-2/3 h-full pl-4 flex flex-col justify-center">
        {playlist.tracks.map(t =>
          <TrackRow
            key={t.id}
            track={t}
            playlist={playlist}
            setPlaylist={setPlaylist}
          />
        )}
      </div>

    </div>
  )
}

export default Playlist
