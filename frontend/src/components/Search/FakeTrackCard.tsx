import type { FC } from "react"

const FakeTrackCard : FC = () => (
  <div className="m-4 w-40 pb-2 h-60 flex flex-col items-center border border-white/20 rounded-md text-center opacity-30 text-white/20">

    <div className="w-40 h-40 rounded-t-md bg-gradient-to-tr from-gray-700/40 to-spotify-greendark/30" />

    <h1 className="w-full my-1 px-2 font-bold text-ellipsis whitespace-nowrap overflow-hidden">Track title</h1>

    <div className="w-full overflow-hidden">
      <h2 className="w-full uppercase text-xs px-2 text-ellipsis whitespace-nowrap overflow-hidden">
        Artist
      </h2>
    </div>
  </div>
)

export default FakeTrackCard
