import type { FC } from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

import type Playlist from "../../interfaces/Playlist"
import playlistsService from "../../services/playlists"
import Loading from "../Loading"

import PlaylistCard from "./PlaylistCard"

const PublicPlaylists : FC = () => {

  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [playlists, setPlaylists] = useState<Playlist[]>()

  useEffect(() => {

    const fetchData = async () => {
      setIsLoading(true)

      try {
        const res = await playlistsService.getPublic()

        setPlaylists(res
          .sort((a : Playlist, b : Playlist) => b.followers.length - a.followers.length)
          .slice(0,10)
        )
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

  }, [])

  if (isLoading) {
    return (
      <div className="relative h-full">
        <Loading small />
      </div>
    )
  }

  if (!playlists || playlists.length === 0) {
    return (
      <h3 className="text-xl ml-4 mt-4 text-white/80 font-bold">
        <>No public playlists found. </>
        <Link to="/playlists/create" className="underline text-spotify-green">Create new playlist!</Link>
      </h3>
    )
  }

  return (
    <div className="relative w-full flex items-center overflow-x-auto">
      {playlists?.map(p => <PlaylistCard key={p._id} p={p} />)}
    </div>
  )
}

export default PublicPlaylists
