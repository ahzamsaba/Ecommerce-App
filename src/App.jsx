import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import {Home, Cart, Login, Signup, OrderSummary, OrderHistory} from './pages/index'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        {/* <Route path='/cart' element={<Cart />} /> */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        <Route
          path='/cart'
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path='/order-summary'
          element={
            <ProtectedRoute>
              <OrderSummary />
            </ProtectedRoute>
          }
        />
        <Route
          path='/order-history'
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
