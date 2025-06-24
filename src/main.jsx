import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import {BrowserRouter} from 'react-router-dom'
import AuthProvider from './context/AuthContext.jsx'
import {Toaster} from 'react-hot-toast'
import CartProvider from './context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <App />
        <Toaster position='top-right' reverseOrder={false} />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
)
