import type { FC } from "react"
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom"
import { Slide, ToastContainer } from "react-toastify"

import CreatePlaylist from "./components/Playlists/CreatePlaylist"
import Playlist from "./components/Playlists/Playlist"
import ProtectedRoute from "./components/ProtectedRoute"
import Sidebar from "./components/Sidebar"
import SideContent from "./components/SideContent"
import Explore from "./pages/Explore"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Playlists from "./pages/Playlists"
import Register from "./pages/Register"

import "../src/assets/styles/index.css"
import "react-toastify/dist/ReactToastify.css"
import "../src/assets/styles/confirmationComponent.css"

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
        { path: "playlists/create", element: <CreatePlaylist /> },
        { path: "playlists/:id", element: <Playlist /> }
      ]
    }
  ])

  return (
    <div className="h-screen w-screen bg-spotify-black text-white">
      <ToastContainer
        position="top-center"
        transition={Slide}
        autoClose={5000}
        theme="colored"
        limit={3}
      />
      <RouterProvider router={router} />
    </div>
  )
}

export default App
