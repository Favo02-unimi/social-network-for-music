import type { FC } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import ProtectedRoute from "./utils/ProtectedRoute"

import "../src/assets/styles/index.css"

const App : FC = () => (
  <BrowserRouter>
    <Routes>

      <Route path="*" element={
        <Navigate to="/home" />
      } />

      <Route path="/home" element={
        <>Home (no login required)</>
      } />

      <Route path="/login" element={
        <>Login</>
      } />

      <Route path="/afterlogin" element={
        <ProtectedRoute>
          <>Login successfull</>
        </ProtectedRoute>
      } />

    </Routes>
  </BrowserRouter>
)

export default App
