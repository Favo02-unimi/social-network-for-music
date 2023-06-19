import type { FC } from "react"
import { MdPublic } from "react-icons/md"

import playlistImg from "../../assets/images/playlist-placeholder.webp"

const FakePlaylistCard : FC = () => (
  <div
    className="my-4 md:m-4 md:w-[400px] h-28 md:h-40 flex items-center border border-white/20 rounded-md text-center hover:bg-white/20 cursor-pointer transition-all duration-700 opacity-20">

    <div className="w-28 md:w-40 shrink-0">
      <img src={playlistImg} className="w-28 h-28 md:w-40 md:h-40 rounded-l-md opacity-80" />
    </div>

    <div className="flex flex-col justify-center w-full h-full relative overflow-hidden p-1">

      <h1 className="w-full px-2 font-bold text-spotify-green/60 md:text-lg shrink-0">
        Playlist title <MdPublic className="inline -mt-1 ml-1" />
      </h1>

      <h2 className="uppercase text-xs px-2 text-ellipsis whitespace-nowrap overflow-hidden font-bold text-white/50 shrink-0">
        BY Author - 14 followers
      </h2>

      <div>
        <h3 className="mt-1 text-sm font-bold text-white/60">5 tracks</h3>
      </div>

      <div className="mt-1 shrink-0 w-full flex flex-row flex-wrap justify-center">
        <h3 className="text-xs bg-gray-500/40 inline m-0.5 rounded px-1 py-0.5">Tag1</h3>
        <h3 className="text-xs bg-gray-500/40 inline m-0.5 rounded px-1 py-0.5">Tag2</h3>
      </div>
    </div>

  </div>
)

export default FakePlaylistCard
