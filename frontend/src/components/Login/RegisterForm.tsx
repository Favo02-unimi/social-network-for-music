import type { FC, FormEvent } from "react"
import { useState } from "react"
import { FaLock, FaUser } from "react-icons/fa"
import { IoMail } from "react-icons/io5"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import usersService from "../../services/users"
import REGEX from "../../utils/regex"
import Loading from "../Loading"

const LoginForm : FC = () => {

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [username, setUsername] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password1, setPassword1] = useState<string>("")
  const [password2, setPassword2] = useState<string>("")

  const handleSubmit = async (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsLoading(true)

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
    if (!REGEX.password.test(password1)) {
      toast.error("Invalid password")
      setIsLoading(false)
      return
    }
    if (!(password1 === password2)) {
      toast.error("Passwords are not the same")
      setIsLoading(false)
      return
    }

    try {
      await usersService.create(username, email, password1)

      toast.success("Registration successfull. Please log in")

      navigate("/login", { replace: true })
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
    <>
      {isLoading && <Loading />}
      <form onSubmit={handleSubmit} className="w-10/12 max-w-md mb-32">

        <div className="text-center mb-5">
          <h1 className="text-4xl font-bold mb-2 text-spotify-green">Register</h1>
          <p className="text-lg text-white"><span className="text-spotify-green">Sign up</span> to unlock all features.</p>
        </div>

        <div className="mb-5">
          <label className="inline-block text-sm mb-1"><FaUser className="inline -mt-1 mr-1" />Username</label>
          <input
            type="text"
            placeholder="GrandePuffo"
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
          <label className="inline-block text-sm mb-1"><FaLock className="inline -mt-1 mr-1" />Password</label>
          <input
            type="password"
            placeholder="P4s$w0rd"
            value={password1}
            onChange={({ target }) => { setPassword1(target.value) }}
            className="w-full text-spotify-black bg-white border-2 border-gray-300 py-2 px-3 rounded-md leading-tight outline-none placeholder:text-gray-400 focus-within:border-spotify-green transition-all duration-700 peer" />
          <div className="text-sm font-light mt-1 text-center max-h-0 overflow-hidden peer-focus-within:max-h-10 transition-all duration-700">{REGEX.passwordDesc}</div>
        </div>

        <div className="mb-10">
          <label className="inline-block text-sm mb-1"><FaLock className="inline -mt-1 mr-1" />Confirm password</label>
          <input
            type="password"
            placeholder="P4s$w0rd"
            value={password2}
            onChange={({ target }) => { setPassword2(target.value) }}
            className="w-full text-spotify-black bg-white border-2 border-gray-300 py-2 px-3 rounded-md leading-tight outline-none placeholder:text-gray-400 focus-within:border-spotify-green transition-all duration-700 peer" />
          <div className="text-sm font-light mt-1 text-center max-h-0 overflow-hidden peer-focus-within:max-h-10 transition-all duration-700">Repeat same password as above</div>
        </div>

        <div className="mb-5">
          <button className={`${isLoading ? "bg-spotify-greendark" : "bg-spotify-green"} text-white shadow-md text-xl px-4 py-2 rounded-md leading-tight hover:bg-spotify-greendark hover:font-bold w-full transition-all duration-700`}>{isLoading ? "Loading..." : "Register"}</button>
        </div>

        <div className="text-center">
          <p className="text-sm text-white">
            <>Already have an account? </>
            <Link to="/login" className="text-spotify-green font-semibold underline">Login</Link>
          </p>
        </div>

      </form>
    </>
  )
}

export default LoginForm
