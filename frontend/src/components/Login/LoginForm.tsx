import type { FC, FormEvent } from "react"
import { useState } from "react"
import { FaLock, FaUser } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import cogoToast from "cogo-toast"

import loginService from "../../services/login"
import REGEX from "../../utils/regex"
import Loading from "../Loading"

const LoginForm : FC = () => {

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const handleSubmit = async (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsLoading(true)

    if (!REGEX.username.test(username)) {
      cogoToast.error("Invalid username")
      setIsLoading(false)
      return
    }
    if (!REGEX.password.test(password)) {
      cogoToast.error("Invalid password")
      setIsLoading(false)
      return
    }

    try {
      const loggedUser = await loginService.login(username, password)

      cogoToast.success("Login successfull")

      localStorage.setItem("user", loggedUser.username)
      localStorage.setItem("token", loggedUser.token)

      navigate("/afterlogin", { replace: true })
    }
    catch(e) {
      cogoToast.error("Invalid username or password")
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
          <h1 className="text-4xl font-bold mb-2 text-spotify-green">Log in</h1>
          <p className="text-lg text-white">Access your <span className="text-spotify-green">account</span> to unlock all features.</p>
        </div>

        <div className="mb-5">
          <label className="inline-block text-sm mb-1"><FaUser className="inline -mt-1 mr-1" />Username</label>
          <input
            type="text"
            placeholder="GrandePuffo"
            value={username}
            onChange={({ target }) => { setUsername(target.value) }}
            className="w-full text-spotify-black bg-white border-2 border-gray-300 py-2 px-3 rounded-md leading-tight outline-none placeholder:text-gray-400 focus-within:border-spotify-green transition-all duration-700" />
        </div>

        <div className="mb-10">
          <label className="inline-block text-sm mb-1"><FaLock className="inline -mt-1 mr-1" />Password</label>
          <input
            type="password"
            placeholder="P4s$w0rd"
            value={password}
            onChange={({ target }) => { setPassword(target.value) }}
            className="w-full text-spotify-black bg-white border-2 border-gray-300 py-2 px-3 rounded-md leading-tight outline-none placeholder:text-gray-400 focus-within:border-spotify-green transition-all duration-700" />
        </div>

        <div className="mb-5">
          <button className={`${isLoading ? "bg-spotify-greendark" : "bg-spotify-green"} text-white shadow-md text-xl px-4 py-2 rounded-md leading-tight hover:bg-spotify-greendark hover:font-bold w-full transition-all duration-700`}>{isLoading ? "Loading..." : "Login"}</button>
        </div>

        <div className="text-center">
          <p className="text-sm text-white">
            <>Don&apos;t have an account? </>
            <Link to="/register" className="text-spotify-green font-semibold underline">Register</Link>
          </p>
        </div>

      </form>
    </>
  )
}

export default LoginForm
