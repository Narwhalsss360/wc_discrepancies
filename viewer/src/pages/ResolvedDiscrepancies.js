import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useServerError from '../hooks/useServerError'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import PageLoading from '../components/PageLoading'
import DiscrepancyCard from '../components/DiscrepancyCard'
import Matrix from '../components/Matrix'
import call from '../api/call'
import apiResolvedDiscrepancies from '../api/resolvedDiscrepancies'

const PIXELS_PER_COLUMN = 550
const calculateColumnCount = () => Math.ceil(visualViewport.width / PIXELS_PER_COLUMN)

export default function ResolvedDiscrepancies() {
  const [resolvedDiscrepancies, setResolvedDiscrepancies] = useState(null)
  const columnCount = calculateColumnCount()
  const isFirstLoad = useRef(true)
  const setServerError = useServerError()[1]
  const navigate = useNavigate()

  useEffect(() => {
    if (!isFirstLoad.current) {
      return
    }
    isFirstLoad.current = false

    call(apiResolvedDiscrepancies)
    .then(resolvedDiscrepancies => {
      setResolvedDiscrepancies(resolvedDiscrepancies)
    })
    .catch(error => {
      console.log(`There was en error fetching resolved discrepancies from server: ${error}`)
      setServerError(error)
      navigate('/server-error')
    })
  }, [isFirstLoad, navigate, setServerError])

  return (
    <Container style={{maxWidth: 'none', width: '100%'}}>
    <Row className='center-flex'>
      {
        resolvedDiscrepancies === null ?
        <PageLoading /> :
        <Matrix columns={columnCount}>
          {
            resolvedDiscrepancies.map(discrepancy => <DiscrepancyCard key={`DiscrepancyCard:${discrepancy.wc_info.first}-${discrepancy.wc_info.last}-${discrepancy.wc_info.id}`} discrepancy={discrepancy} />)
          }
        </Matrix>
      }
    </Row>
    </Container>
  )
}
