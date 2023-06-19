import type { FC } from "react"
import { IoIosArrowBack } from "react-icons/io"
import { Link, Navigate } from "react-router-dom"

import LoginForm from "../components/Login/LoginForm"
import useAuth from "../hooks/useAuth"

const Login : FC = () => {

  const [auth] = useAuth()

  if (auth) {
    return <Navigate to="/home" replace />
  }

  return (
    <div className="relative w-screen h-screen flex items-center justify-center">

      <Link to="/home" className="absolute top-6 left-5 uppercase italic hover:text-white/80">
        <IoIosArrowBack className="inline text-2xl -mt-1" />Home
      </Link>

      <LoginForm />
    </div>
  )
}

export default Login
