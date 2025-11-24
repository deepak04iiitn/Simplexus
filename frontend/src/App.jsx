import React from 'react'
import Home from './pages/Home'
import Footer from './components/Footer'
import Header from './components/Header'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import About from './pages/About'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'

export default function App() {
  return (
    <HelmetProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow">
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/about' element={<About />} />
                <Route path='/sign-in' element={<SignIn />} />
                <Route path='/sign-up' element={<SignUp />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
    </HelmetProvider>
  )
}
