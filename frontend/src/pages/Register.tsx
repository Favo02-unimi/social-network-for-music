import type { FC } from "react"
import { Navigate } from "react-router-dom"

import RegisterForm from "../components/Login/RegisterForm"
import useAuth from "../hooks/useAuth"

const Register : FC = () => {

  const [auth] = useAuth()

  if (auth) {
    return <Navigate to="/home" replace />
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <RegisterForm />
    </div>
  )
}

export default Register
