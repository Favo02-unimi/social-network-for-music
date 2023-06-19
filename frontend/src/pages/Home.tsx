import type { FC } from "react"

import Recommendations from "../components/Explore/Recommendations"
import PublicPlaylists from "../components/Playlists/PublicPlaylists"

const Home : FC = () => (
  <div className="text-center w-full h-full min-h-screen md:min-h-0 border border-white/20 rounded-md p-6 flex flex-col md:justify-center items-center">

    <div className="mt-10 w-full h-full md:h-[40%] md:border-b border-white/20 flex flex-col justify-center">
      <h1 className="text-spotify-green text-3xl font-bold ml-4">Public playlists</h1>
      <h2 className="text-xl font-semibold ml-4 mb-4">Explore and follow public playlists created by other users!</h2>
      <PublicPlaylists />
    </div>

    <div className="mt-10 w-full h-full md:h-[60%] flex flex-col justify-center">
      <h1 className="text-spotify-green text-3xl font-bold ml-4">Recommended for you</h1>
      <h2 className="text-xl font-semibold ml-4 mb-4">Personalized list of recommendations for you! Based on your favourite artists and genres.</h2>
      <Recommendations />
    </div>
  </div>
)

export default Home
