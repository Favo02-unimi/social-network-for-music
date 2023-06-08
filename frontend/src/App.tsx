import type { FC } from "react"
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom"

import CreatePlaylist from "./components/Playlists/CreatePlaylist"
import ProtectedRoute from "./components/ProtectedRoute"
import Sidebar from "./components/Sidebar"
import SideContent from "./components/SideContent"
import Explore from "./pages/Explore"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Playlists from "./pages/Playlists"
import Register from "./pages/Register"

import "../src/assets/styles/index.css"

const App : FC = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/home" replace />
    },
    {
      path: "/home",
      element: <Sidebar sideContent={<SideContent />}><Home /></Sidebar>
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "*",
      element: <ProtectedRoute><Sidebar sideContent={<SideContent />}><Outlet /></Sidebar></ProtectedRoute>,
      children: [
        { path: "*", element: <Navigate to="/home" replace /> },
        { path: "explore", element: <Explore /> },
        { path: "playlists", element: <Playlists /> },
        { path: "playlists/create", element: <CreatePlaylist /> }
      ]
    }
  ])

  return (
    <div className="h-screen w-screen bg-spotify-black text-white">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
