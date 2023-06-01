import { useEffect, useState } from "react"

import loginService from "../services/login"

const useAuth = () => {
  const [auth, setAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const authenticate = async () => {

      const token = localStorage.getItem("token")

      if (!token) {
        setAuth(false)
        setIsLoading(false)
        return
      }

      try {
        await loginService.verify(token)
        setAuth(true)
      }
      catch (err) {
        setAuth(false)
      }
      finally {
        setIsLoading(false)
      }
    }

    authenticate()
  }, [])

  return [auth, isLoading]
}

export default useAuth
