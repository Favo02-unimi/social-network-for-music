import type { FC } from "react"
import { IoIosArrowBack } from "react-icons/io"
import { Link, Navigate } from "react-router-dom"

import RegisterForm from "../components/Login/RegisterForm"
import useAuth from "../hooks/useAuth"

const Register : FC = () => {

  const [auth] = useAuth()

  if (auth) {
    return <Navigate to="/home" replace />
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">

      <Link to="/login" className="absolute top-6 left-5 uppercase italic hover:text-white/80">
        <IoIosArrowBack className="inline text-2xl -mt-1" />Login
      </Link>

      <RegisterForm />
    </div>
  )
}

export default Register
