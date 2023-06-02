import type { FC } from "react"
import { Navigate } from "react-router-dom"

import LoginForm from "../components/Login/LoginForm"
import useAuth from "../hooks/useAuth"

const Login : FC = () => {

  const [auth] = useAuth()

  if (auth) {
    return <Navigate to="/home" replace />
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  )
}

export default Login
