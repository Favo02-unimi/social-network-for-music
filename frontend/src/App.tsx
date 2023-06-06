import type { FC } from "react"
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom"

import ProtectedRoute from "./components/ProtectedRoute"
import Sidebar from "./components/Sidebar"
import SideContent from "./components/SideContent"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Search from "./pages/Search"

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
        { path: "search", element: <Search /> }
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
