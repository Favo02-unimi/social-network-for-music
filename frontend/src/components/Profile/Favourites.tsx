import type { FC } from "react"
import { Link } from "react-router-dom"


const Favourites : FC<{title : string, list ?: string[]}> = ({ title, list }) => {

  if (!list || list.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold text-center">Favourite <span className="text-spotify-green">{title}</span></h2>
        <h3 className="mt-2 text-white/80">No favourite {title} found</h3>
        <Link to={`/profile/edit${title}`} className="mt-4 bg-spotify-greendark px-3 py-1 rounded-lg hover:bg-spotify-green font-bold transition-all duration-700">Add {title}</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold text-center">Favourite <span className="text-spotify-green">{title}</span></h2>

      {/* TODO: link artists/genre to search for that artist/genre */}
      <div className="w-2/3 mt-2 flex flex-wrap justify-center items-center">
        {list.map(a => <div key={a} className="ml-0.5 bg-gray-300/30 px-2 py-0.5 rounded m-0.5">{a}</div>)}
      </div>

      <Link to={`/profile/edit${title}`} className="mt-4 bg-spotify-greendark px-3 py-1 rounded-lg hover:bg-spotify-green font-bold transition-all duration-700">Edit {title}</Link>
    </div>
  )
}

export default Favourites
