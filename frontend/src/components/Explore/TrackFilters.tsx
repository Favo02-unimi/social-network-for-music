import type { FC } from "react"
import type { ChangeResult } from "multi-range-slider-react"
import MultiRangeSlider from "multi-range-slider-react"

import "../../assets/styles/sliderComponent.css"

const TrackFilters : FC<{
  artist : string,
  setArtist : (a : string) => void,
  genre : string,
  setGenre : (g : string) => void,
  yearMin : number,
  setYearMin : (y : number) => void,
  yearMax : number,
  setYearMax : (p : number) => void
}> = ({ artist, setArtist, genre, setGenre, yearMin, setYearMin, yearMax, setYearMax }) => {

  const handleYeatChange = (e : ChangeResult) => {
    setYearMin(e.minValue)
    setYearMax(e.maxValue)
  }

  return (
    <div className="">
      <div className="flex">
        <div className="inline w-1/2 mr-2">
          <h3 className="text-center font-semibold italic">Artist:</h3>
          <input
            type="text"
            placeholder="Artist"
            value={artist}
            onChange={({ target }) => { setArtist(target.value) }}
            className="w-[200px] text-white bg-white/20 border-2 border-transparent py-2 px-3 rounded-md leading-tight outline-none placeholder:text-gray-400 focus-within:border-spotify-green transition-all duration-700"
          />
        </div>
        <div className="inline w-1/2 ml-2">
          <h3 className="text-center font-semibold italic">Genre:</h3>
          <input
            type="text"
            placeholder="Genre"
            value={genre}
            onChange={({ target }) => { setGenre(target.value) }}
            className="w-[200px] text-white bg-white/20 border-2 border-transparent py-2 px-3 rounded-md leading-tight outline-none placeholder:text-gray-400 focus-within:border-spotify-green transition-all duration-700"
          />
        </div>
      </div>
      <h3 className="text-center mt-2 font-semibold italic">Year of release (on spotify):</h3>
      <MultiRangeSlider
        min={2008}
        max={2023}
        step={1}
        minValue={yearMin}
        maxValue={yearMax}
        onInput={(e) => {
          handleYeatChange(e)
        }}
        labels={[yearMin.toString(), yearMax.toString()]}
        ruler={false}
      />
    </div>
  )
}

export default TrackFilters
