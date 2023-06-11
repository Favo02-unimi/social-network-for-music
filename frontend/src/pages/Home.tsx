import type { FC } from "react"

import PublicPlaylists from "../components/Playlists/PublicPlaylists"

const Home : FC = () => (
  <div className="w-full h-full border border-white/20 rounded-md p-6 flex flex-col justify-center items-center">

    <div className="w-full h-1/3 border-b border-white/20 flex flex-col justify-center">
      <h1 className="text-spotify-green text-3xl font-bold ml-4">Public playlists</h1>
      <h2 className="text-xl font-semibold ml-4">Explore and follow public playlists created by other users!</h2>
      <PublicPlaylists />
    </div>

    <div className="w-full h-1/3 border-b border-white/20 flex flex-col justify-center">
      <h1 className="text-spotify-green text-3xl font-bold ml-4">Recommended for you</h1>
      <h2 className="text-xl font-semibold ml-4">Personalized list of recommendations for you!</h2>
      <h3 className="text-xl ml-4 mt-4 text-white/80 font-bold">Work in progress - Coming soon.</h3>
    </div>

    <div className="w-full h-1/3 flex flex-col justify-center">
      <h1 className="text-spotify-green text-3xl font-bold ml-4">Latest releases</h1>
      <h2 className="text-xl font-semibold ml-4">Discover latest releases worldwide!</h2>
      <h3 className="text-xl ml-4 mt-4 text-white/80 font-bold">Work in progress - Coming soon.</h3>
    </div>
  </div>
)

export default Home
