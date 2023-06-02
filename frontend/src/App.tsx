import type { FC } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import Login from "./pages/Login"
import ProtectedRoute from "./utils/ProtectedRoute"

import "../src/assets/styles/index.css"


const App : FC = () => (
  <div className="h-screen w-screen bg-spotify-black text-white">
    <BrowserRouter>
      <Routes>

        <Route path="*" element={
          <Navigate to="/home" replace />
        } />

        <Route path="/home" element={
          <>Home (no login required)</>
        } />

        <Route path="/login" element={
          <Login />
        } />

        <Route path="/afterlogin" element={
          <ProtectedRoute>
            <>Login successfull</>
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  </div>
)

export default App
