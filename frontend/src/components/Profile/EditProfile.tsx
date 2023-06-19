import type { FC, FormEvent } from "react"
import { useEffect, useState } from "react"
import { FaLock, FaUser } from "react-icons/fa"
import { IoIosArrowBack } from "react-icons/io"
import { IoMail } from "react-icons/io5"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

import usersService from "../../services/users"
import checkTokenExpiration from "../../utils/checkTokenExpiration"
import REGEX from "../../utils/regex"
import Loading from "../Loading"

import "../../assets/styles/tagsComponent.css"

const EditProfile : FC = () => {

  const { id } = useParams()

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [username, setUsername] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [newPassword2, setNewPassword2] = useState<string>("")
  const [oldPassword, setOldPassword] = useState<string>("")

  // fetch current data
  useEffect(() => {

    const fetchUser = async () => {
      setIsLoading(true)

      try {
        const { valid, message } = checkTokenExpiration()
        if (!valid) {
          toast.error(message)
          navigate("/login", { replace: true })
          return
        }

        const res = await usersService.getMe()
        setUsername(res.username)
        setEmail(res.email)
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

  }, [id, navigate])

  // edit
  const handleEdit = async (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsLoading(true)

    if (!REGEX.password.test(oldPassword)) {
      toast.error("Invalid old password")
      setIsLoading(false)
      return
    }
    if (!REGEX.username.test(username)) {
      toast.error("Invalid username")
      setIsLoading(false)
      return
    }
    if (!REGEX.email.test(email)) {
      toast.error("Invalid email")
      setIsLoading(false)
      return
    }
    if (newPassword && !REGEX.password.test(newPassword)) {
      toast.error("Invalid new password")
      setIsLoading(false)
      return
    }
    if (newPassword && (newPassword !== newPassword2)) {
      toast.error("New passwords are different")
      setIsLoading(false)
      return
    }

    try {
      const { valid, message } = checkTokenExpiration()
      if (!valid) {
        toast.error(message)
        navigate("/login",  { replace: true })
        return
      }

      await usersService.edit(oldPassword, username, email, newPassword)

      toast.success("Profile edited successfully.")

      navigate("/profile", { replace: true })
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

  return (
    <div className="relative w-full h-full border border-white/20 rounded-md p-6 flex justify-center items-center">

      {isLoading && <Loading small />}

      <Link to="/profile" className=" absolute top-6 left-5 uppercase italic hover:text-white/80">
        <IoIosArrowBack className="inline text-2xl -mt-1" />Profile
      </Link>

      <form onSubmit={handleEdit} className="w-10/12 max-w-md mb-20">

        <div className="text-center mb-5">
          <h1 className="text-4xl font-bold mb-2 text-spotify-green">Edit profile</h1>
          <p className="text-lg text-white">Edit your <span className="text-spotify-green">data</span>.</p>
        </div>

        <div className="mb-5">
          <label className="inline-block text-sm mb-1"><FaLock className="inline -mt-1 mr-1" />Current password</label>
          <input
            type="password"
            placeholder="P4s$w0rd"
            value={oldPassword}
            onChange={({ target }) => { setOldPassword(target.value) }}
            className="w-full text-spotify-black bg-white border-2 border-gray-300 py-2 px-3 rounded-md leading-tight outline-none placeholder:text-gray-400 focus-within:border-spotify-green transition-all duration-700 peer" />
          <div className="text-sm font-light mt-1 text-center max-h-0 overflow-hidden peer-focus-within:max-h-10 transition-all duration-700">Insert current password to successfully edit your profile</div>
        </div>

        <div className="mb-5">
          <label className="inline-block text-sm mb-1"><FaUser className="inline -mt-1 mr-1" />Username</label>
          <input
            type="text"
            placeholder="Grande Puffo"
            value={username}
            onChange={({ target }) => { setUsername(target.value) }}
            className="w-full text-spotify-black bg-white border-2 border-gray-300 py-2 px-3 rounded-md leading-tight outline-none placeholder:text-gray-400 focus-within:border-spotify-green transition-all duration-700 peer" />
          <div className="text-sm font-light mt-1 text-center max-h-0 overflow-hidden peer-focus-within:max-h-10 transition-all duration-700">{REGEX.usernameDesc}</div>
        </div>

        <div className="mb-5">
          <label className="inline-block text-sm mb-1"><IoMail className="inline -mt-1 mr-1" />Email</label>
          <input
            type="text"
            placeholder="grande@puffi.com"
            value={email}
            onChange={({ target }) => { setEmail(target.value) }}
            className="w-full text-spotify-black bg-white border-2 border-gray-300 py-2 px-3 rounded-md leading-tight outline-none placeholder:text-gray-400 focus-within:border-spotify-green transition-all duration-700 peer" />
          <div className="text-sm font-light mt-1 text-center max-h-0 overflow-hidden peer-focus-within:max-h-10 transition-all duration-700">{REGEX.emailDesc}</div>
        </div>

        <div className="mb-5">
          <label className="inline-block text-sm mb-1"><FaLock className="inline -mt-1 mr-1" />New password</label>
          <input
            type="password"
            placeholder="P4s$w0rd"
            value={newPassword}
            onChange={({ target }) => { setNewPassword(target.value) }}
            className="w-full text-spotify-black bg-white border-2 border-gray-300 py-2 px-3 rounded-md leading-tight outline-none placeholder:text-gray-400 focus-within:border-spotify-green transition-all duration-700 peer" />
          <div className="text-sm font-light mt-1 text-center max-h-0 overflow-hidden peer-focus-within:max-h-10 transition-all duration-700">Not required. {REGEX.passwordDesc}</div>
        </div>

        <div className="mb-5">
          <label className="inline-block text-sm mb-1"><FaLock className="inline -mt-1 mr-1" />Confirm new password</label>
          <input
            type="password"
            placeholder="P4s$w0rd"
            value={newPassword2}
            onChange={({ target }) => { setNewPassword2(target.value) }}
            className="w-full text-spotify-black bg-white border-2 border-gray-300 py-2 px-3 rounded-md leading-tight outline-none placeholder:text-gray-400 focus-within:border-spotify-green transition-all duration-700 peer" />
          <div className="text-sm font-light mt-1 text-center max-h-0 overflow-hidden peer-focus-within:max-h-10 transition-all duration-700">Repeat same password as above</div>
        </div>

        <div className="mb-5">
          <button className={`${isLoading ? "bg-spotify-greendark" : "bg-spotify-green"} text-white shadow-md text-xl px-4 py-2 rounded-md leading-tight hover:bg-spotify-greendark hover:font-bold w-full transition-all duration-700`}>{isLoading ? "Loading..." : "Edit profile"}</button>
        </div>

      </form>
    </div>
  )
}

export default EditProfile
