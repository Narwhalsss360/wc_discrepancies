import React, { useCallback, useEffect, useRef, useState } from 'react'
import Matrix from '../components/Matrix'
import DiscrepancyCard from '../components/DiscrepancyCard'
import Spinner from 'react-bootstrap/Spinner'
import call from '../api/call'
import apiDiscrepancies from '../api/discrepancies'
import useServerError from '../hooks/useServerError'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [discrepancies, setDiscrepancies] = useState(null)
  const setServerError = useServerError()[1]
  const navigate = useNavigate()
  const isFirstLoad = useRef(true)

  const refreshDiscrepancies = useCallback(() => {
    call(apiDiscrepancies)
    .then(discrepancies => {
      setDiscrepancies(discrepancies)
    })
    .catch(error => {
      console.log(`There was an error fetching from the server: ${error}`)
      setServerError(error)
      navigate('/server-error')
    })
  }, [setDiscrepancies, setServerError, navigate])

  useEffect(() => {
    if (!isFirstLoad.current) {
      return
    }
    isFirstLoad.current = false
    refreshDiscrepancies()
  }, [isFirstLoad, refreshDiscrepancies])

  return (
    discrepancies === null ?
    <Spinner /> :
    <Matrix columns={4}>
      {
        discrepancies.map(discrepancy => <DiscrepancyCard discrepancy={discrepancy} />)
      }
    </Matrix>
  )
}
