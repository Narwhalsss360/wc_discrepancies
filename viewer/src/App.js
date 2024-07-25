import React, { createContext, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import NavigationBarLayout from './components/NavigationBarLayout'
import ServerError from './pages/ServerError'
import Details from './pages/Details'

export const SelectedDiscrepancyContext = createContext(null)
export const ServerErrorContext = createContext(null)

export default function App() {
  const selectedDiscrepancyState = useState(null)
  const serverErrorState = useState(null)

  return (
    <BrowserRouter>
      <SelectedDiscrepancyContext.Provider value={selectedDiscrepancyState}>
        <ServerErrorContext.Provider value={serverErrorState}>
          <Routes>
            <Route path='/' element={<NavigationBarLayout />}>
              <Route index element={<Home />} />
              <Route path='details' element={<Details />} />
              <Route path='server-error' element={<ServerError />} />
              <Route path='*' element={<h1>HTTP 404: {new URL(document.URL).pathname} Not found</h1>}/>
            </Route>
          </Routes>
        </ServerErrorContext.Provider>
      </SelectedDiscrepancyContext.Provider>
    </BrowserRouter>
  )
}
