import type { FC } from "react"
import { FiMenu } from "react-icons/fi"

const MobileMenu : FC<{
  menuOpen : boolean,
  setMenuOpen : (b : boolean) => void
}> = ({ menuOpen, setMenuOpen }) => (
  <div className="block fixed top-4 md:hidden w-screen text-center z-50" onClick={() => setMenuOpen(!menuOpen)}>
    <h1 className="w-full text-3xl font-bold -skew-y-3 bg-spotify-green pb-1">SNM</h1>
    <FiMenu className="absolute top-4 left-3 -skew-y-3 text-3xl" />
  </div>
)

export default MobileMenu
