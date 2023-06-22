import type { FC } from "react"
import { useEffect, useState } from "react"
import { confirmAlert } from "react-confirm-alert"
import { FaHeart, FaHeartBroken, FaLock, FaUsers } from "react-icons/fa"
import { ImBin2 } from "react-icons/im"
import { MdModeEdit, MdPublic } from "react-icons/md"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

import type PlaylistInterface from "../../interfaces/Playlist"
import playlistsService from "../../services/playlists"
import checkTokenExpiration from "../../utils/checkTokenExpiration"
import Loading from "../Loading"

import Followers from "./Followers"
import PlaylistImage from "./PlaylistImage"
import TrackRow from "./TrackRow"

const Playlist : FC = () => {

  const { id } = useParams()

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [playlist, setPlaylist] = useState<PlaylistInterface>()

  const [showFollowers, setShowFollowers] = useState<boolean>(false)

  useEffect(() => {

    const fetchData = async () => {
      setIsLoading(true)

      try {
        const { valid, message } = checkTokenExpiration()
        if (!valid) {
          toast.error(message)
          navigate("/login", { replace: true })
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
        navigate("/login",  { replace: true })
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

    setShowFollowers(false)

    try {
      const { valid, message } = checkTokenExpiration()
      if (!valid) {
        toast.error(message)
        navigate("/login",  { replace: true })
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

    setShowFollowers(false)

    try {
      const { valid, message } = checkTokenExpiration()
      if (!valid) {
        toast.error(message)
        navigate("/login",  { replace: true })
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
    <div className="relative w-full h-full min-h-screen md:min-h-0 border border-white/20 rounded-md p-6 flex flex-col md:flex-row justify-center items-center">
      {isLoading && <Loading small />}

      <div className="w-full md:w-1/3 h-full md:border-r border-white/20 md:pr-4 flex flex-col justify-center items-center -skew-y-2">

        <PlaylistImage tracks={playlist.tracks} customClasses="h-36 w-36 md:h-64 md:w-64 rounded-md" />

        <h1 className="mt-2 font-bold text-spotify-green text-2xl md:text-3xl shrink-0">
          {playlist.title}
          {playlist.isPublic
            ? <MdPublic className="inline text-spotify-greendark text-xl -mt-1 ml-2" />
            : <FaLock className="inline text-spotify-greendark text-xl -mt-1 ml-2" />
          }
        </h1>

        <h2 className="uppercase px-2 text-ellipsis whitespace-nowrap overflow-hidden font-bold text-white/50 shrink-0">
          <span>BY {playlist.creator}</span>
          <> - </>
          <span className="cursor-pointer" onClick={() => setShowFollowers(!showFollowers)}>{playlist.followers.length} followers</span>
        </h2>

        <h4 className="text-center mt-2">{playlist.description}</h4>

        <div>
          <h3 className="mt-1 text-lg md:text-xl font-bold">{playlist.tracks.length} tracks</h3>
        </div>

        <div className="mt-2 shrink-0 w-full flex flex-row flex-wrap justify-center">
          {playlist.tags.map(t =>
            <Link to="/explore/playlists" state={{ redirectTag: t }} key={t}>
              <h3 className="cursor-pointer hover:underline bg-gray-500/40 inline m-1 rounded px-2 py-0.5">
                {t}
              </h3>
            </Link>
          )}
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

          {(playlist.isCreator) &&
            <div
              onClick={() => setShowFollowers(!showFollowers)}
              className={`text-white/70 w-full block border rounded-md px-4 py-1 my-4 text-center md:hover:bg-white/20 md:hover:text-white transition-all duration-700 cursor-pointer ${showFollowers ? "bg-white/20" : ""}`}
            >
              <FaUsers className="inline -mt-1 mr-1" />Manage collaborators
            </div>
          }

          {(playlist.isCreator || playlist.isCollaborator) &&
            <Link
              to={`/playlists/${playlist._id}/edit`}
              className="text-white/70 w-full block border rounded-md px-4 py-1 my-4 text-center hover:bg-white/20 hover:text-white transition-all duration-700"
            >
              <MdModeEdit className="inline -mt-1 mr-1" />Edit playlist
            </Link>
          }

          {playlist.isCreator &&
            <div
              onClick={handleDeletePlaylist}
              className="cursor-pointer text-red-700/70 w-full block border border-red-700/70 rounded-md px-4 py-1 my-4 text-center hover:bg-red-700/20 hover:text-red-700 transition-all duration-700"
            >
              <ImBin2 className="inline -mt-1 mr-1" />Delete playlist
            </div>
          }
        </div>

      </div>

      <div className="hidden md:flex relative w-full md:w-2/3 h-full md:pl-4 flex-col justify-center overflow-y-auto">
        {showFollowers
          ?
          <Followers
            playlist={playlist}
            isCreator={playlist.isCreator}
            setIsLoading={setIsLoading}
            setShowFollowers={setShowFollowers}
            setPlaylist={setPlaylist}
          />
          :
          playlist.tracks.map(t =>
            <TrackRow
              key={t.id}
              track={t}
              playlist={playlist}
              setPlaylist={setPlaylist}
            />
          )
        }
      </div>

      <div className="flex md:hidden relative w-full md:w-2/3 h-full md:pl-4 flex-col justify-center overflow-y-auto">
        {showFollowers
          &&
          <Followers
            playlist={playlist}
            isCreator={playlist.isCreator}
            setIsLoading={setIsLoading}
            setShowFollowers={setShowFollowers}
            setPlaylist={setPlaylist}
          />
        }
        {
          playlist.tracks.map(t =>
            <TrackRow
              key={t.id}
              track={t}
              playlist={playlist}
              setPlaylist={setPlaylist}
            />
          )
        }
      </div>



    </div>
  )
}

export default Playlist
