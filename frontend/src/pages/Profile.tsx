import type { FC } from "react"
import { useEffect,useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import Loading from "../components/Loading"
import DeleteAccount from "../components/Profile/DeleteAccount"
import FavouriteArtists from "../components/Profile/FavouriteArtists"
import FavouriteGenres from "../components/Profile/FavouriteGenres"
import type User from "../interfaces/User"
import usersService from "../services/users"
import checkTokenExpiration from "../utils/checkTokenExpiration"

const Profile : FC = () => {

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [user, setUser] = useState<User>()

  useEffect(() => {

    const fetchUser = async () => {
      setIsLoading(true)

      try {
        const { valid, message } = checkTokenExpiration()
        if (!valid) {
          toast.error(message)
          navigate("/login")
          return
        }

        const res = await usersService.getMe()
        setUser(res)
      }
      catch(e) {
        if (e?.response?.data?.error) {
          toast.error(e.response.data.error)
        } else {
          toast.error("Generic error, please try again")
        }
      }
      finally {
        setIsLoading(false)
      }
    }

    fetchUser()

  }, [navigate])

  const handleLogout = () => {
    window.localStorage.removeItem("token")
    window.localStorage.removeItem("expires")
    navigate("/home")
  }

  if (!user) {
    return (
      <div className="relative w-full h-full border border-white/20 rounded-md p-6 flex flex-col justify-center items-center">
        {isLoading && <Loading small />}
      </div>
    )
  }

  return (
    <div className="relative w-full h-full border border-white/20 rounded-md p-6 flex flex-col justify-center items-center">
      {isLoading && <Loading small />}

      <h1 className="text-3xl mb-8">Hello, <span className="text-spotify-green font-bold">{user.username}</span></h1>

      <FavouriteArtists
        list={user.favouriteArtists}
        setUser={setUser}
        setIsLoading={setIsLoading}
      />

      <div className="my-8 h-[1px] w-full border-t border-white/20" />

      <FavouriteGenres
        list={user.favouriteGenres}
        setUser={setUser}
        setIsLoading={setIsLoading}
      />

      <div className="mt-8 h-[1px] w-full border-t border-white/20" />

      <div className="text-center mt-4">
        <h2 className="text-xl font-bold">Personal information</h2>
        <h3 className="mt-2">Username: <span className="ml-0.5 bg-gray-300/30 px-2 py-0.5 rounded">{user.username}</span></h3>
        <h3 className="mt-2">Email: <span className="ml-0.5 bg-gray-300/30 px-2 py-0.5 rounded">{user.email}</span></h3>
      </div>

      <Link to="/profile/edit" className="mt-10 bg-spotify-greendark px-3 py-1 rounded-lg hover:bg-spotify-green font-bold transition-all duration-700">Edit profile</Link>

      <div onClick={handleLogout} className="mt-4 border-2 border-red-800 px-3 py-1 rounded-lg hover:bg-red-800/40 text-red-600 font-bold cursor-pointer transition-all duration-700">Logout</div>

      <DeleteAccount setIsLoading={setIsLoading} handleLogout={handleLogout} />

    </div>
  )
}

export default Profile
