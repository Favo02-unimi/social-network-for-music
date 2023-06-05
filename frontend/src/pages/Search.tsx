import type { FC } from "react"
import { useState } from "react"
import cogoToast from "cogo-toast"

import Loading from "../components/Loading"
import SearchBox from "../components/Search/SearchBox"
import type Track from "../interfaces/Track"
import spotifyService from "../services/spotify"

const Search : FC = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [tracks, setTracks] = useState<Track[]>()
  const [openTrack, setOpenTrack] = useState<Track>()

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
    <>
      {isLoading && <Loading />}
      <div className="w-full h-full border border-white/20 rounded-md p-6 flex justify-center items-center">

        <SearchBox
          tracks={tracks}
          handleSearch={handleSearch}
          openTrack={openTrack}
          setOpenTrack={setOpenTrack}
        />

        <div className="ml-2 w-1/3 h-full border-l-2 border-white/20">
          {openTrack?.id}
        </div>

      </div>
    </>
  )
}

export default Search
