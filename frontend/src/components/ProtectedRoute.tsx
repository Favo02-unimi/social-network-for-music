import type { FC } from "react"
import { Navigate } from "react-router-dom"

import Loading from "../components/Loading"
import useAuth from "../hooks/useAuth"

const ProtectedRoute : FC<{children : React.ReactNode}> = ({ children }) => {

  const [auth, isLoading] = useAuth()

  if (!auth && !isLoading) {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    return <Navigate to="/login" />
  }

  return (
    <>
      {isLoading && <Loading />}
      {children}
    </>
  )
}

export default ProtectedRoute
