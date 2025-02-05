import React, { createContext, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import NavigationBarLayout from './components/NavigationBarLayout'
import ServerError from './pages/ServerError'
import Details from './pages/Details'
import Help from './pages/Help'
import Logs from './pages/Logs'
import ReportBug from './pages/ReportBug'
import Resolve from './pages/Resolve'
import ResolvedDiscrepancies from './pages/ResolvedDiscrepancies'

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
              <Route path='resolved-discrepancies' element={<ResolvedDiscrepancies />} />
              <Route path='details' element={<Details />} />
              <Route path='server-error' element={<ServerError />} />
              <Route path='logs' element={<Logs />} />
              <Route path='help' element={<Help />} />
              <Route path='report-bug' element={<ReportBug />} />
              <Route path='resolve' element={<Resolve />} />
              <Route path='*' element={<h1>HTTP 404: {new URL(document.URL).pathname} Not found</h1>}/>
            </Route>
          </Routes>
        </ServerErrorContext.Provider>
      </SelectedDiscrepancyContext.Provider>
    </BrowserRouter>
  )
}
