import React, { createContext, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import NavigationBarLayout from './components/NavigationBarLayout'

export const SelectedDiscrepancyContext = createContext(null)

export default function App() {
  const selectedDiscrepancyState = useState(null)

  return (
    <BrowserRouter>
      <SelectedDiscrepancyContext.Provider value={selectedDiscrepancyState}>
          <Routes>
            <Route path='/' element={<NavigationBarLayout />}>
              <Route index element={<Home />} />
            </Route>
          </Routes>
      </SelectedDiscrepancyContext.Provider>
    </BrowserRouter>
  )
}
