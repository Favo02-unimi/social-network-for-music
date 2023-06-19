import type { FC } from "react"
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import type Track from "../../interfaces/Track"
import spotifyService from "../../services/spotify"
import checkTokenExpiration from "../../utils/checkTokenExpiration"
import Loading from "../Loading"

import TrackCard from "./TrackCard"

const Recommendations : FC<{customClasses ?: string}> = ({ customClasses }) => {

  const navigate = useNavigate()
  const location = useLocation()

  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [tracks, setTracks] = useState<Track[]>()

  useEffect(() => {

    const fetchData = async () => {
      setIsLoading(true)

      try {
        const { valid, message, type } = checkTokenExpiration()
        if (!valid) {

          // in home do not display missing token error
          if (location.pathname === "/home") {
            // in home display only expired
            if (type === "expired") {
              toast.error(message)
              navigate("/login", { replace: true })
            }
          }
          // not in home display all errors
          else {
            toast.error(message)
            navigate("/login", { replace: true })
          }

          return
        }

        const res = await spotifyService.recommendations()

        setTracks(res.tracks)
      }
      catch(e) {
        if (e?.response?.data?.error) {

          // do not display toast if no favourites
          if (e.response.data.error === "No favourite genres or artists: cannot generate recommendations") {
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

  }, [location, navigate])

  if (isLoading) {
    return (
      <div className="relative h-full min-h-screen">
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
    <div className={`relative ${customClasses}`}>
      {tracks?.map(t => <TrackCard key={t.id} track={t} onclick={() => {navigate(`/explore/tracks/${t.id}`)}} />)}
    </div>
  )
}

export default Recommendations
