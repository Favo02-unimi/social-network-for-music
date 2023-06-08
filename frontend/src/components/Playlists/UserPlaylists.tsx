import type { FC } from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import cogoToast from "cogo-toast"

import type Playlist from "../../interfaces/Playlist"
import playlistsService from "../../services/playlists"
import Loading from "../Loading"

import FakePlaylistCard from "./FakePlaylistCard"
import PlaylistCard from "./PlaylistCard"

const UserPlaylists : FC = () => {

  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [playlists, setPlaylists] = useState<Playlist[]>()

  useEffect(() => {

    const fetchData = async () => {
      setIsLoading(true)

      try {
        const res = await playlistsService.getAll()
        setPlaylists(res)
      }
      catch(e) {
        if (e?.response?.data?.error) {
          cogoToast.error(e.response.data.error)
        } else {
          cogoToast.error("Generic error, please try again")
        }
      }
      finally {
        setIsLoading(false)
      }
    }

    fetchData()

  }, [])

  if (isLoading || playlists?.length === 0) {
    return (
      <div className="relative w-full h-full mt-4 flex flex-wrap my-auto justify-center overflow-y-auto">
        {isLoading && <Loading small />}
        <div className="absolute w-full h-full flex flex-col justify-center items-center font-bold text-2xl -mt-10 z-10">
          <h1 className="uppercase opacity-80">No playlists found...</h1>
          <Link to="/home" className="mt-2 opacity-80 hover:opacity-100 transition-all duration-700 group">...explore <span className="text-spotify-green group-hover:underline">public playlists</span></Link>
          <Link to="/playlists/create" className="mt-2 opacity-80 hover:opacity-100 transition-all duration-700 group">...or create <span className="text-spotify-green group-hover:underline">new playlist</span></Link>
        </div>
        {Array(6).fill(true).map((_, i) => <FakePlaylistCard key={i} />)}
      </div>
    )
  }

  return (
    <div className="relative w-full h-full mt-4 flex flex-wrap my-auto justify-center items-center overflow-y-auto">
      {isLoading && <Loading small />}
      {playlists?.map(p => <PlaylistCard key={p._id} p={p} />)}
    </div>
  )
}

export default UserPlaylists