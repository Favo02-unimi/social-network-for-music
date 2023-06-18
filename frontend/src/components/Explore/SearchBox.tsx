import type { FC } from "react"
import { useEffect, useState } from "react"
import { MdExpandLess, MdExpandMore } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import type Track from "../../interfaces/Track"
import spotifyService from "../../services/spotify"
import checkTokenExpiration from "../../utils/checkTokenExpiration"
import REGEX from "../../utils/regex"
import Loading from "../Loading"

import Filters from "./Filters"
import Recommendations from "./Recommendations"
import TrackCard from "./TrackCard"

const SearchBox : FC<{
  isLoading : boolean,
  setIsLoading : (l : boolean) => void,
  openTrack ?: Track
}> = ({ isLoading, setIsLoading, openTrack }) => {

  const [query, setQuery] = useState<string>("")

  const [filtersOpen, setFiltersOpen] = useState<boolean>(false)
  const [artist, setArtist] = useState<string>("")
  const [genre, setGenre] = useState<string>("")
  const [yearMin, setYearMin] = useState<number>(2008)
  const [yearMax, setYearMax] = useState<number>(2023)

  const navigate = useNavigate()

  const [isInvalid, setIsInvalid] = useState<boolean>(false)

  const [tracks, setTracks] = useState<Track[]>()

  useEffect(() => {
    const handleSearch = async () => {
      if (query.length < 2 && artist.length < 2 && genre.length < 2) {
        setTracks([])
        return
      }

      setIsLoading(true)

      if (
        (query.length >= 2 && !REGEX.query.test(query)) ||
        (artist.length >= 2 && !REGEX.query.test(artist)) ||
        (genre.length >= 2 && !REGEX.query.test(genre))
      ) {
        setIsLoading(false)
        setIsInvalid(true)
        return
      }
      else {
        setIsInvalid(false)
      }

      try {
        const { valid, message } = checkTokenExpiration()
        if (!valid) {
          toast.error(message)
          navigate("/login")
          return
        }

        const res = await spotifyService.tracks(query, artist, genre, yearMin, yearMax)
        setTracks(res?.tracks?.items)
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

    // debounce
    const timeoutId = setTimeout(() => {
      handleSearch()
    }, 300)

    // clear debounce
    return () => clearTimeout(timeoutId)
  }, [query, artist, genre, yearMin, yearMax, setIsLoading, navigate])

  return (
    <div className={`${openTrack ? "w-2/3" : "w-full"} h-full flex flex-col justify-center items-center`}>
      <h1 className="text-2xl font-bold text-center">Explore <span className="text-spotify-green italic">tracks</span> to fill your <span className="text-spotify-green italic">playlists</span>!</h1>

      <div className="flex flex-col justify-center items-center">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={({ target }) => { setQuery(target.value) }}
          className="mt-4 w-[500px] text-white bg-white/20 border-2 border-transparent py-2 px-3 rounded-md leading-tight outline-none placeholder:text-gray-400 focus-within:border-spotify-green transition-all duration-700" />
        {isInvalid && <h3 className="max-w-[750px] text-center text-red-700">Invalid search query or filters. Please use the following format: {REGEX.queryDesc}.</h3>}

        <h2
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="text-lg font-bold my-2 cursor-pointer"
        >
          {filtersOpen ? <MdExpandLess className="inline -mt-1" /> : <MdExpandMore className="inline -mt-1" />}
            Advanced filters
          {filtersOpen ? <MdExpandLess className="inline -mt-1" /> : <MdExpandMore className="inline -mt-1" />}
        </h2>

        {filtersOpen && <Filters
          artist={artist}
          setArtist={setArtist}
          genre={genre}
          setGenre={setGenre}
          yearMin={yearMin}
          setYearMin={setYearMin}
          yearMax={yearMax}
          setYearMax={setYearMax}
        />}
      </div>

      {!tracks || tracks.length === 0
        ?
        <div className="relative w-full h-full mt-4 flex flex-col justify-center items-center overflow-y-auto">
          <h1 className="text-xl font-bold"><span className="text-spotify-green">Recommendations</span> for you, based on your favourites.</h1>
          <h1 className="text-lg italic">Start typing to search for specific tracks.</h1>
          <Recommendations customClasses="w-full h-full flex-wrap justify-center" />
        </div>
        :
        <div className="relative w-full h-full mt-2 flex flex-wrap justify-center items-center overflow-y-auto">
          {isLoading && <Loading small={true} />}
          {tracks.map(t =>
            <TrackCard
              track={t}
              key={t.id}
              openTrack={openTrack}
              onclick={() => navigate(`/explore/${t.id}`)}
            />
          )}
        </div>
      }
    </div>
  )
}

export default SearchBox
