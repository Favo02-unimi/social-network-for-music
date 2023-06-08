import type { FC } from "react"
import { FaPlus } from "react-icons/fa"
import { Link } from "react-router-dom"

import UserPlaylists from "../components/Playlists/UserPlaylists"

const Playlists : FC = () => (
  <div className="relative w-full h-full border border-white/20 rounded-md p-6 flex flex-col text-center">

    <h1 className="text-2xl font-bold text-center">
      <span>Your </span>
      <span className="text-spotify-green italic">followed</span>
      <span>, </span>
      <span className="text-spotify-green italic">created</span>
      <span> or </span>
      <span className="text-spotify-green italic">collaborated</span>
      <span> playlists.</span>
    </h1>

    <UserPlaylists />

    <Link
      to="/playlists/create"
      className="absolute bottom-10 left-1/2 -translate-x-1/2 -skew-y-2 text-xl uppercase bg-spotify-green hover:bg-spotify-greendark text-white font-bold py-2 px-4 rounded-md transition-all duration-700 z-10"
    ><FaPlus className="inline -mt-1 mr-2 text-xl" />New playlist</Link>

  </div>
)

export default Playlists
