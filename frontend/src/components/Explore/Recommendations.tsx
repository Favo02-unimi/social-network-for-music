import type { FC } from "react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import type Track from "../../interfaces/Track"
import spotifyService from "../../services/spotify"
import Loading from "../Loading"

import TrackCard from "./TrackCard"

const Recommendations : FC<{customClasses ?: string}> = ({ customClasses }) => {

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [tracks, setTracks] = useState<Track[]>()

  useEffect(() => {

    const fetchData = async () => {
      setIsLoading(true)

      try {
        const res = await spotifyService.recommendations()

        setTracks(res.tracks)
      }
      catch(e) {
        if (e?.response?.data?.error) {

          // do not display toast if no favourites
          if (e.response.data.error === "No favourite genres or artists: cannot generate recommendations") {
            return
          }

          // do not display invalid token (homepage should be open to everyone)
          if (e.response.data.error === "invalid token" || e.response.data.error === "missing token") {
            return
          }

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

  if (!tracks || tracks.length === 0) {
    return (
      <h3 className="text-xl ml-4 mt-4 text-white/80 font-bold">
        <>No favourite genres or artists: cannot generate recommendations. </>
        <Link to="/profile" className="underline text-spotify-green">Add favourites!</Link>
      </h3>
    )
  }

  return (
    <div className={`relative w-full flex items-center overflow-x-auto ${customClasses}`}>
      {tracks?.map(t => <TrackCard key={t.id} track={t} onclick={() => {navigate(`/explore/${t.id}`)}} />)}
    </div>
  )
}

export default Recommendations
