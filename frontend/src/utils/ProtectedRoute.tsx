import type { FC } from "react"
import { Navigate } from "react-router-dom"

import Loading from "../components/Loading"
import useAuth from "../hooks/useAuth"

const ProtectedRoute : FC<{children : React.ReactNode}> = ({ children }) => {

  const [auth, isLoading] = useAuth()

  if(isLoading) {
    return <Loading />
  }

  if (!auth) {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    return <Navigate to="/login" />
  }

  return <>{children}</>

}

export default ProtectedRoute
