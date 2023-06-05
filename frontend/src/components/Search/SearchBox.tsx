import type { FC } from "react"

import type Track from "../../interfaces/Track"

import FakeTrackCard from "./FakeTrackCard"
import TrackCard from "./TrackCard"

const SearchBox : FC<{
  tracks ?: Track[],
  handleSearch : ((query : string) => void),
  openTrack ?: Track,
  setOpenTrack : ((t : Track) => void)
}> = ({ tracks, handleSearch, openTrack, setOpenTrack }) => (

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
        {Array(20).fill(true).map((_, i) => <FakeTrackCard key={i} />)}
      </div>
      :
      <div className="w-full h-full mt-4 flex flex-wrap justify-center items-center overflow-y-auto">
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

export default SearchBox
