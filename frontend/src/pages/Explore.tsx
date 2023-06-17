import type { FC } from "react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"

import OpenTrack from "../components/Explore/OpenTrack"
import SearchBox from "../components/Explore/SearchBox"
import type Track from "../interfaces/Track"
import spotifyService from "../services/spotify"

const Explore : FC = () => {

  const { trackId } = useParams()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [openTrack, setOpenTrack] = useState<Track>()

  useEffect(() => {
    const fetchTrack = async (id : string) => {
      setIsLoading(true)

      try {
        const res = await spotifyService.track(id)

        setOpenTrack(res)
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

    if (trackId && openTrack?.id !== trackId) {
      fetchTrack(trackId)
    }
  }, [trackId, openTrack?.id])

  return (
    <div className="w-full h-full border border-white/20 rounded-md p-6 flex justify-center items-center">

      <SearchBox
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        openTrack={openTrack}
      />

      {openTrack &&
        <OpenTrack
          isLoading={isLoading}
          track={openTrack}
          setOpenTrack={setOpenTrack}
        />
      }

    </div>
  )
}

export default Explore
