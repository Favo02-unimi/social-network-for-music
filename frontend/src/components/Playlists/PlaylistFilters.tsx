import type { FC } from "react"

const TrackFilters : FC<{
  title : string,
  setTitle : (a : string) => void,
  author : string,
  setAuthor : (g : string) => void,
  tag : string,
  setTag : (t : string) => void,
  track : string,
  setTrack : (t : string) => void
}> = ({ title, setTitle, author, setAuthor, tag, setTag, track, setTrack }) => (
  <div className="grid grid-cols-2 gap-2">

    <div className="flex flex-col items-center">
      <h3 className="text-center font-semibold italic">Playlist title:</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={({ target }) => { setTitle(target.value) }}
        className="w-[200px] text-white bg-white/20 border-2 border-transparent py-2 px-3 rounded-md leading-tight outline-none placeholder:text-gray-400 focus-within:border-spotify-green transition-all duration-700"
      />
    </div>

    <div className="flex flex-col items-center">
      <h3 className="text-center font-semibold italic">Playlist author:</h3>
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={({ target }) => { setAuthor(target.value) }}
        className="w-[200px] text-white bg-white/20 border-2 border-transparent py-2 px-3 rounded-md leading-tight outline-none placeholder:text-gray-400 focus-within:border-spotify-green transition-all duration-700"
      />
    </div>

    <div className="flex flex-col items-center">
      <h3 className="text-center font-semibold italic">Playlist tag:</h3>
      <input
        type="text"
        placeholder="Tag"
        value={tag}
        onChange={({ target }) => { setTag(target.value) }}
        className="w-[200px] text-white bg-white/20 border-2 border-transparent py-2 px-3 rounded-md leading-tight outline-none placeholder:text-gray-400 focus-within:border-spotify-green transition-all duration-700"
      />
    </div>

    <div className="flex flex-col items-center">
      <h3 className="text-center font-semibold italic">Track contained in playlist:</h3>
      <input
        type="text"
        placeholder="Track"
        value={track}
        onChange={({ target }) => { setTrack(target.value) }}
        className="w-[200px] text-white bg-white/20 border-2 border-transparent py-2 px-3 rounded-md leading-tight outline-none placeholder:text-gray-400 focus-within:border-spotify-green transition-all duration-700"
      />
    </div>

  </div>
)

export default TrackFilters
