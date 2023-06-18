import type { FC } from "react"
import { useEffect, useState } from "react"
import { IoIosArrowBack } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import type Follower from "../../interfaces/Follower"
import type Playlist from "../../interfaces/Playlist"
import playlistsService from "../../services/playlists"
import checkTokenExpiration from "../../utils/checkTokenExpiration"

const Followers : FC<{
  playlist : Playlist,
  isCreator : boolean,
  setIsLoading : (l : boolean) => void
  setShowFollowers : (s : boolean) => void
  setPlaylist : (p : Playlist) => void
}> = ({ playlist, isCreator, setIsLoading, setShowFollowers, setPlaylist }) => {

  const navigate = useNavigate()

  const [followers, setFollowers] = useState<Follower[]>([])

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

        const res = await playlistsService.followers(playlist._id)

        setFollowers(res)
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

  }, [navigate, playlist._id, setIsLoading])


  const handleAddCollaborator = async (username : string, id : string) => {
    setIsLoading(true)

    try {
      const { valid, message } = checkTokenExpiration()
      if (!valid) {
        toast.error(message)
        navigate("/login")
        return
      }

      const updatedPlaylist = await playlistsService.addCollaborator(playlist._id, id)

      toast.success(`Added ${username} as collaborator`)
      setPlaylist({
        ...updatedPlaylist,
        isCollaborator: playlist.isCollaborator,
        isCreator: playlist.isCreator,
        isFollower: playlist.isFollower
      })
      setShowFollowers(false)
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

  const handleRemoveCollaborator = async (username : string, id : string) => {
    setIsLoading(true)

    try {
      const { valid, message } = checkTokenExpiration()
      if (!valid) {
        toast.error(message)
        navigate("/login")
        return
      }

      const updatedPlaylist = await playlistsService.removeCollaborator(playlist._id, id)

      toast.success(`Removed ${username} from collaborators`)
      setPlaylist({
        ...updatedPlaylist,
        isCollaborator: playlist.isCollaborator,
        isCreator: playlist.isCreator,
        isFollower: playlist.isFollower
      })
      setShowFollowers(false)
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
    <>
      <div onClick={() => setShowFollowers(false)} className="cursor-pointer absolute top-6 left-5 uppercase italic hover:text-white/80">
        <IoIosArrowBack className="inline text-2xl -mt-1" />Tracks
      </div>

      <div className="flex text-center">
        <h1 className="w-1/3 uppercase italic text-white/80">username</h1>
        <h1 className="w-1/3 uppercase italic text-white/80">role</h1>
        <h1 className="w-1/3 uppercase italic text-white/80">controls</h1>
      </div>
      {followers.map(f =>
        <div key={f.userId} className="w-full my-2 h-10 flex flex-row items-center transition-all duration-700">
          <h1 className="w-1/3 text-xl font-semibold text-center">{f.username}</h1>
          <h1 className="w-1/3 text-sm font-semibold text-center text-spotify-green">{f.isCreator ? "CREATOR" : f.isCollaborator ? "COLLABORATOR" : ""}</h1>

          {!isCreator && <h1 className="w-1/3 text-xs text-white/80 italic text-center uppercase">Only creator can access controls</h1>}

          {(isCreator && f.isCreator) &&
            <h1
              className="w-1/3 font-semibold text-white/60 text-center rounded-md border border-white/60 opacity-30"
            >Make collaborator</h1>
          }

          {(isCreator && f.isCollaborator) &&
            <h1
              onClick={() => handleRemoveCollaborator(f.username, f.userId)}
              className="w-1/3 font-semibold text-white/60 text-center rounded-md border border-white/60 cursor-pointer hover:bg-white/20 transition-all duration-700"
            >Remove collaborator</h1>
          }

          {(isCreator && (!f.isCollaborator && !f.isCreator)) &&
            <h1
              onClick={() => handleAddCollaborator(f.username, f.userId)}
              className="w-1/3 font-semibold text-white/60 text-center rounded-md border border-white/60 cursor-pointer hover:bg-white/20 transition-all duration-700"
            >Make collaborator</h1>
          }

        </div>
      )}

    </>
  )
}

export default Followers
