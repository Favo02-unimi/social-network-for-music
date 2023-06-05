import type { FC } from "react"
import { useState } from "react"
import cogoToast from "cogo-toast"

import type Track from "../../interfaces/Track"
import spotifyService from "../../services/spotify"
import Loading from "../Loading"

import FakeTrackCard from "./FakeTrackCard"
import TrackCard from "./TrackCard"

const SearchBox : FC<{
  openTrack ?: Track,
  setOpenTrack : ((t : Track) => void),
}> = ({ openTrack, setOpenTrack }) => {

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [tracks, setTracks] = useState<Track[]>()

  const handleSearch = async (query : string) => {
    if (query.length < 2) {
      setTracks([])
      return
    }

    setIsLoading(true)

    try {
      const res = await spotifyService.all(query)
      setTracks(res?.tracks?.items)
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

  return (
    <div className={`${openTrack ? "w-2/3" : "w-full"} h-full flex flex-col justify-center items-center`}>
      <h1 className="text-2xl font-bold text-center">Search <span className="text-spotify-green italic">tracks</span> to fill your <span className="text-spotify-green italic">playlists</span>!</h1>

      <div className="flex flex-col justify-center items-center">
        <input
          type="text"
          placeholder="Search..."
          onChange={({ target }) => { handleSearch(target.value) }}
          className="mt-4 w-[500px] text-white bg-white/20 border-2 border-transparent py-2 px-3 rounded-md leading-tight outline-none placeholder:text-gray-400 focus-within:border-spotify-green transition-all duration-700" />
      </div>

      {!tracks || tracks.length === 0
        ?
        <div className="relative w-full h-full mt-4 flex flex-wrap justify-center items-center overflow-y-auto">
          <div className="absolute w-full h-full flex justify-center items-center uppercase font-bold text-2xl -mt-10 opacity-60">Start typing to search tracks...</div>
          {isLoading && <Loading small={true} />}
          {Array(20).fill(true).map((_, i) => <FakeTrackCard key={i} />)}
        </div>
        :
        <div className="relative w-full h-full mt-4 flex flex-wrap justify-center items-center overflow-y-auto">
          {isLoading && <Loading small={true} />}
          {tracks.map(t =>
            <TrackCard
              track={t}
              key={t.id}
              openTrack={openTrack}
              setOpenTrack={setOpenTrack}
            />
          )}
        </div>
      }
    </div>
  )
}

export default SearchBox
