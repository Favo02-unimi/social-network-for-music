import type { FC } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import Loading from "./components/Loading"
import Sidebar from "./components/Sidebar"
import useAuth from "./hooks/useAuth"
import Home from "./pages/Home"
import Login from "./pages/Login"

import "../src/assets/styles/index.css"

const App : FC = () => {

  const [auth, isLoading] = useAuth()

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-spotify-black text-white">
        <Loading />
      </div>
    )
  }

  // no login routes
  if (!auth) {
    return (
      <div className="h-screen w-screen bg-spotify-black text-white">
        <BrowserRouter>
          <Routes>

            <Route path="/" element={
              <Navigate to="/home" replace />
            } />

            <Route path="/home" element={
              <Sidebar
                sideContent={<>side</>}
                content={<Home />}
              />
            } />

            <Route path="/login" element={
              <Login />
            } />

            <Route path="*" element={
              <Navigate to="/login" replace />
            } />

          </Routes>
        </BrowserRouter>
      </div>
    )
  }

  // logged in routes
  return (
    <div className="h-screen w-screen bg-spotify-black text-white">
      <Sidebar
        sideContent={<>side</>}
        content={
          <BrowserRouter>
            <Routes>

              <Route path="/home" element={<Home />} />

              <Route path="/afterlogin" element={<>Login successfull</>} />

              <Route path="*" element={<Navigate to="/home" replace />} />

            </Routes>
          </BrowserRouter>
        }
      />
    </div>
  )
}

export default App
