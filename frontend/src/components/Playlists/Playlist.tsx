import type { FC } from "react"
import { useEffect, useState } from "react"
import { confirmAlert } from "react-confirm-alert"
import { FaHeart, FaHeartBroken, FaLock } from "react-icons/fa"
import { ImBin2 } from "react-icons/im"
import { MdModeEdit, MdPublic } from "react-icons/md"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

import type PlaylistInterface from "../../interfaces/Playlist"
import playlistsService from "../../services/playlists"
import checkTokenExpiration from "../../utils/checkTokenExpiration"
import Loading from "../Loading"

import PlaylistImage from "./PlaylistImage"
import TrackRow from "./TrackRow"

const Playlist : FC = () => {

  const { id } = useParams()

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [playlist, setPlaylist] = useState<PlaylistInterface>()

  useEffect(() => {

    const fetchData = async () => {
      setIsLoading(true)

      try {
        const { valid, message } = checkTokenExpiration()
        if (!valid) {
          toast.error(message)
          navigate("/login")
          return
        }

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

  }, [id, navigate])

  if (!playlist) {
    return (
      <div className="relative w-full h-full border border-white/20 rounded-md p-6 flex justify-center items-center">
        {isLoading && <Loading small />}
      </div>
    )
  }

  const handleDeletePlaylist = () => {
    confirmAlert({
      title: "Confirm deletion",
      message: `Are you sure to delete "${playlist.title}"?`,
      buttons: [
        {
          label: "Cancel"
        },
        {
          label: "Delete",
          className: "remove",
          onClick: deletePlaylist
        }
      ]
    })
  }

  const deletePlaylist = async () => {

    setIsLoading(true)

    try {
      const { valid, message } = checkTokenExpiration()
      if (!valid) {
        toast.error(message)
        navigate("/login")
        return
      }

      await playlistsService.deletee(playlist._id)

      toast.success(`Deleted playlist ${playlist.title}.`)

      navigate("/playlists")
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

  const handleFollowPlaylist = async () => {

    setIsLoading(true)

    try {
      const { valid, message } = checkTokenExpiration()
      if (!valid) {
        toast.error(message)
        navigate("/login")
        return
      }

      const updatedPlaylist = await playlistsService.follow(playlist._id)

      toast.success(`Playlist ${playlist.title} followed.`)

      setPlaylist({
        ...updatedPlaylist,
        isFollower: true
      })
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

  const handleUnfollowPlaylist = async () => {

    setIsLoading(true)

    try {
      const { valid, message } = checkTokenExpiration()
      if (!valid) {
        toast.error(message)
        navigate("/login")
        return
      }

      const updatedPlaylist = await playlistsService.unfollow(playlist._id)

      toast.success(`Playlist ${playlist.title} unfollowed.`)

      setPlaylist(updatedPlaylist)
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

        <h4 className="text-center mt-2">{playlist.description}</h4>

        <div>
          <h3 className="mt-1 text-xl font-bold">{playlist.tracks.length} tracks</h3>
        </div>

        <div className="mt-2 shrink-0 w-full flex flex-row flex-wrap justify-center">
          {playlist.tags.map(t => <h3 className="bg-gray-500/40 inline m-1 rounded px-2 py-0.5" key={t}>{t}</h3>)}
        </div>

        {(playlist.isCreator || playlist.isCollaborator || playlist.isFollower) &&
          <h3 className="mt-4 text-spotify-green font-bold uppercase text-lg px-4 opacity-50 border border-spotify-green rounded-md text-center">
            {playlist.isCollaborator
              ? "collaborator"
              : playlist.isCreator
                ? "creator"
                : "follower"
            }
          </h3>
        }

        {/* TODO: collaborators */}

        <div>
          {!playlist.isFollower &&
            <div
              onClick={handleFollowPlaylist}
              className="cursor-pointer text-spotify-green/70 w-full block border border-spotify-green/70 rounded-md px-4 py-1 mt-4 mb-2 text-center hover:bg-spotify-green/20 hover:spotify-green transition-all duration-700"
            >
              <FaHeart className="inline -mt-1 mr-1" />Follow playlist
            </div>
          }

          {(playlist.isFollower && !playlist.isCreator) &&
            <div
              onClick={handleUnfollowPlaylist}
              className="cursor-pointer text-spotify-green/70 w-full block border border-spotify-green/70 rounded-md px-4 py-1 mt-4 mb-2 text-center hover:bg-spotify-green/20 hover:spotify-green transition-all duration-700"
            >
              <FaHeartBroken className="inline -mt-1 mr-1" />Unfollow playlist
            </div>
          }

          {(playlist.isCreator || playlist.isCollaborator) &&
            <Link
              to={`/playlists/${playlist._id}/edit`}
              className="text-white/70 w-full block border rounded-md px-4 py-1 mt-4 mb-2 text-center hover:bg-white/20 hover:text-white transition-all duration-700"
            >
              <MdModeEdit className="inline -mt-1 mr-1" />Edit playlist
            </Link>
          }

          {playlist.isCreator &&
            <div
              onClick={handleDeletePlaylist}
              className="cursor-pointer text-red-700/70 w-full block border border-red-700/70 rounded-md px-4 py-1 text-center hover:bg-red-700/20 hover:text-red-700 transition-all duration-700"
            >
              <ImBin2 className="inline -mt-1 mr-1" />Delete playlist
            </div>
          }
        </div>

      </div>

      <div className="w-2/3 h-full pl-4 flex flex-col justify-center overflow-y-auto">
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
