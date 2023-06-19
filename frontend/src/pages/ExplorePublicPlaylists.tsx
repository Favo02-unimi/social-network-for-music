import type { FC } from "react"
import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa"
import { MdExpandLess, MdExpandMore } from "react-icons/md"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

import Loading from "../components/Loading"
import PlaylistCard from "../components/Playlists/PlaylistCard"
import PlaylistFilters from "../components/Playlists/PlaylistFilters"
import type Playlist from "../interfaces/Playlist"
import playlistsService from "../services/playlists"

const PublicPlaylists : FC = () => {

  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [filteredPlaylists, setFilteredPlaylists] = useState<Playlist[]>([])

  const [filtersOpen, setFiltersOpen] = useState<boolean>(false)

  const [title, setTitle] = useState<string>("")
  const [author, setAuthor] = useState<string>("")
  const [tag, setTag] = useState<string>("")
  const [track, setTrack] = useState<string>("")

  useEffect(() => {

    const fetchData = async () => {
      setIsLoading(true)

      try {
        const res = await playlistsService.getPublic()

        setPlaylists(res.sort((a : Playlist, b : Playlist) => b.followers.length - a.followers.length))
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

  useEffect(() => {
    setFilteredPlaylists(playlists.filter(p => {
      if (title) {
        if (!p.title.match(new RegExp(title, "i"))) return false
      }

      if (author) {
        if (!p.creator.match(new RegExp(author, "i"))) return false
      }

      if (tag) {
        if (!p.tags.find(t => t.match(new RegExp(tag, "i")))) return false
      }

      if (track) {
        if (!p.tracks.find(t => t.name.match(new RegExp(track, "i")))) return false
      }

      return true
    }))
  }, [playlists, title, author, tag, track])

  return (
    <div className="relative w-full h-full border border-white/20 rounded-md p-6 flex flex-col justify-center items-center">
      {isLoading && <Loading small />}

      <h1 className="text-xl font-bold">{playlists.length} public <span className="text-spotify-green">playlists</span> found</h1>
      <h1 className="text-llg font-semibold text-white/70">Displaying {filteredPlaylists.length} <span className="text-spotify-green">filtered</span> playlists</h1>

      <h2
        onClick={() => setFiltersOpen(!filtersOpen)}
        className="text-lg font-bold my-2 cursor-pointer"
      >
        {filtersOpen ? <MdExpandLess className="inline -mt-1" /> : <MdExpandMore className="inline -mt-1" />}
          Advanced filters
        {filtersOpen ? <MdExpandLess className="inline -mt-1" /> : <MdExpandMore className="inline -mt-1" />}
      </h2>

      {filtersOpen && <PlaylistFilters
        title={title}
        setTitle={setTitle}
        author={author}
        setAuthor={setAuthor}
        tag={tag}
        setTag={setTag}
        track={track}
        setTrack={setTrack}
      />}

      {playlists.length === 0
        ?
        <div className="relative w-full h-full flex items-center justify-center">
          <h3 className="-mt-10 text-xl text-white/80 font-bold">
            <>No public playlists found. </>
            <Link to="/playlists/create" className="underline text-spotify-green">Create new playlist!</Link>
          </h3>
        </div>
        :
        filteredPlaylists.length === 0
          ?
          <div className="relative w-full h-full flex items-center justify-center">
            <h3 className="-mt-10 text-xl text-white/80 font-bold">
              <>No playlists matching these <span className="text-spotify-green">filters</span> found. </>
            </h3>
          </div>
          :
          <div className="relative w-full h-full flex flex-wrap justify-center items-center overflow-y-auto">
            {filteredPlaylists?.map(p => <PlaylistCard key={p._id} p={p} />)}
          </div>
      }

      <Link
        to="/playlists/create"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 -skew-y-2 text-xl uppercase bg-spotify-green hover:bg-spotify-greendark text-white font-bold py-2 px-4 rounded-md transition-all duration-700 z-10"
      ><FaPlus className="inline -mt-1 mr-2 text-xl" />New playlist</Link>
    </div>
  )
}

export default PublicPlaylists
