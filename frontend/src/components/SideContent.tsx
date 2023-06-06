import type { FC } from "react"
import { FaUser } from "react-icons/fa"
import { Link, NavLink } from "react-router-dom"

import packageInfo from "../../package.json"

const SideContent : FC = () => {

  const links = [
    { to: "/home", text: "Homepage" },
    { to: "/explore", text: "Explore" }
  ]

  return (
    <div className="w-full h-full border border-white/20 rounded-md flex flex-col justify-between text-center py-6">

      <div className="">
        <h1 className="text-6xl font-bold -skew-y-3 bg-spotify-green pb-1">SNM</h1>
        <h3 className="-skew-y-3 text-lg font-bold">Social Network for Music</h3>
      </div>

      <div className="">
        {links.map(l =>
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive } : {isActive : boolean}) => ( isActive
              ? "block my-2 py-0.5 -skew-y-3 text-lg font-bold bg-spotify-greendark "
              : "block my-2 -skew-y-3 text-lg font-bold hover:bg-spotify-greendark/50 transition-all duration-500"
            )}
          >{l.text}</NavLink>
        )}
      </div>

      <div>
        <div className="mb-2">
          <NavLink
            to="profile"
            className="inline-block px-10 py-1 bg-spotify-greendark hover:bg-spotify-green rounded-2xl tracking-widest font-medium text-lg transition-all duration-500"
          ><FaUser className="inline text-sm -mt-1.5 mr-2" />PROFILE</NavLink>
        </div>

        <div className="text-white/40 text-xs">
          <h5>
            <span>{packageInfo.version} - Built by </span>
            <Link
              to="https://github.com/Favo02"
              target="_blank"
              className="underline underline-offset-2"
            >Luca Favini</Link>
          </h5>
          <h6 className="text-xs">
            <Link
              to="https://github.com/Favo02/SocialNetworkForMusic"
              target="_blank"
              className="underline underline-offset-2 mr-1"
            >Source code</Link>
            <Link
              to="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              className="underline underline-offset-2"
            >(CC-BY 4.0 License)</Link>
          </h6>
        </div>
      </div>
    </div>
  )
}

export default SideContent
