import type { FC } from "react"
import { FaLock } from "react-icons/fa"
import { MdPublic } from "react-icons/md"
import { Link } from "react-router-dom"

import type Playlist from "../../interfaces/Playlist"

import PlaylistImage from "./PlaylistImage"

const PlaylistCard : FC<{ p : Playlist }> = ({ p }) => (
  <Link
    to={`/playlists/${p._id}`}
    className="m-4 w-[400px] h-40 flex items-center border border-white/20 rounded-md text-center hover:bg-white/20 cursor-pointer transition-all duration-700">

    <div className="w-40 shrink-0">
      <PlaylistImage tracks={p.tracks} customClasses="w-40 h-40 rounded-l-md" />
    </div>

    <div className="flex flex-col justify-center w-full h-full relative overflow-hidden p-1">

      {(p.isCreator || p.isCollaborator) &&
        <h3 className="absolute w-40 top-6 -right-12 rotate-45 px-2 text-spotify-green font-bold opacity-50 border border-spotify-green uppercase inline-block mx-auto rounded-md text-xs">{p.isCreator ? "creator" : "collaborator"}</h3>
      }

      <h1 className="w-full px-2 font-bold text-spotify-green text-lg shrink-0">
        {p.title}
        {p.isPublic
          ? <MdPublic className="inline -mt-1 ml-1" />
          : <FaLock className="inline -mt-1 ml-1" />
        }
      </h1>

      <h2 className="uppercase text-xs px-2 text-ellipsis whitespace-nowrap overflow-hidden font-bold text-white/50 shrink-0">
        BY {p.creator} - {p.followers.length} followers
      </h2>

      <div>
        <h3 className="mt-1 text-sm font-bold">{p.tracks.length} tracks</h3>
      </div>

      <div className="mt-1 shrink-0 w-full flex flex-row flex-wrap justify-center">
        {p.tags.map(t => <h3 className="text-xs bg-gray-500/40 inline m-0.5 rounded px-1 py-0.5" key={t}>{t}</h3>)}
      </div>
    </div>

  </Link>
)

export default PlaylistCard
