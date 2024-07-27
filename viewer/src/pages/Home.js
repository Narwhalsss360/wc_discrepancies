import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useServerError from '../hooks/useServerError'
import Matrix from '../components/Matrix'
import PageLoading from '../components/PageLoading'
import DiscrepancyCard from '../components/DiscrepancyCard'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import call from '../api/call'
import apiDiscrepancies from '../api/discrepancies'
import { isPrintable } from '../components/ObjectPropertiesList'
import '../styles/center-flex.css'

const PIXELS_PER_COLUMN = 550
const calculateColumnCount = () => Math.ceil(visualViewport.width / PIXELS_PER_COLUMN)

function objectContainsLowerCase(obj, string) {
  if (obj === null) {
    return 'null'.includes(string);
  }

  if (Array.isArray(obj)) {
    for (const item in obj) {
      if (objectContainsLowerCase(item, string)) {
        return true
      }
    }
    return false
  }

  for (const key in obj) {
    const value = obj[key]
    if (isPrintable(value)) {
      if (`${value}`.toLowerCase().includes(string)) {
        return true
      }
    } else {
      if (objectContainsLowerCase(value, string)) {
        return true
      }
    }
  }

  return false
}

async function filterAsync(array, predicate) {
  const results = await Promise.all(array.map(predicate))
  return array.filter((value, index) => results[index])
}

export default function Home() {
  const [discrepancies, setDiscrepancies] = useState(null)
  const [query, setQuery] = useState('')
  const [filteredDiscrepancies, setFilteredDiscrepancies] = useState(discrepancies)
  const setServerError = useServerError()[1]
  const navigate = useNavigate()
  const isFirstLoad = useRef(true)
  const columnCount = calculateColumnCount()

  const filterByQuery = useCallback(() => {
    if (query === '') {
      setFilteredDiscrepancies(discrepancies)
    } else if (discrepancies !== null) {
      setFilteredDiscrepancies(null) //Show spinner while filtering
      const includes = query.toLowerCase()
      filterAsync(discrepancies, discrepancy => objectContainsLowerCase(discrepancy, includes))
      .then(filtered => setFilteredDiscrepancies(filtered))
    }
  }, [setFilteredDiscrepancies, discrepancies, query])

  const refreshDiscrepancies = useCallback(() => {
    call(apiDiscrepancies)
    .then(discrepancies => {
      setDiscrepancies(discrepancies)
      filterByQuery()
    })
    .catch(error => {
      console.log(`There was an error fetching from the server: ${error}`)
      setServerError(error)
      navigate('/server-error')
    })
  }, [setDiscrepancies, setServerError, navigate, filterByQuery])

  useEffect(() => {
    if (!isFirstLoad.current) {
      return
    }
    isFirstLoad.current = false
    refreshDiscrepancies()
  }, [isFirstLoad, refreshDiscrepancies])

  useEffect(filterByQuery, [query, filterByQuery])

  return (
    <Container style={{maxWidth: 'none', width: '100%'}}>
      <Row className='center-flex'>
        <input style={{width: '70%', margin: '10px'}} placeholder='Search' value={query} onChange={evt => setQuery(evt.target.value)}/>
        <Button style={{width: '5%', margin: '10px'}} variant='outline-danger' onClick={evt => navigate('/resolved-discrepancies')}>Resolved</Button>
      </Row>
      <Row>
        {
          filteredDiscrepancies === null ?
          <PageLoading /> :
          <Matrix columns={columnCount}>
            {
              filteredDiscrepancies.map(discrepancy => <DiscrepancyCard key={`DiscrepancyCard:${discrepancy.wc_info.first}-${discrepancy.wc_info.last}-${discrepancy.wc_info.id}`} discrepancy={discrepancy} />)
            }
          </Matrix>
        }
      </Row>
    </Container>
  )
}
