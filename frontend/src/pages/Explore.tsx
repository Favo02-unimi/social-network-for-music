import type { FC } from "react"
import { useState } from "react"

import OpenTrack from "../components/Explore/OpenTrack"
import SearchBox from "../components/Explore/SearchBox"
import type Track from "../interfaces/Track"

const Explore : FC = () => {

  const [openTrack, setOpenTrack] = useState<Track>()

  return (
    <>
      <div className="w-full h-full border border-white/20 rounded-md p-6 flex justify-center items-center">

        <SearchBox
          openTrack={openTrack}
          setOpenTrack={setOpenTrack}
        />

        {openTrack &&
          <OpenTrack
            track={openTrack}
            setOpenTrack={setOpenTrack}
          />
        }

      </div>
    </>
  )
}

export default Explore
