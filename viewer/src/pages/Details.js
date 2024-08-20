import React, { useEffect } from 'react'
import useSelectedDiscrepancy from '../hooks/useSelectedDiscrepancy'
import { useNavigate } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

import ObjectPropertiesList from '../components/ObjectPropertiesList'
import Button from 'react-bootstrap/esm/Button'

export default function Details() {
  const selectedDiscrepancy = useSelectedDiscrepancy()[0]
  const navigate = useNavigate()

  useEffect(() => {
    if (selectedDiscrepancy === null) {
      navigate('/')
    }
  }, [selectedDiscrepancy, navigate])

  return (
    <Container>
      <Col style={{padding: '15px'}}>
        <Row>
          <h1 align='center'>Discrepancy Details</h1>
          <Button variant='outline-danger' onClick={evt => navigate('/resolve')} disabled={selectedDiscrepancy.resolved_by !== null}>Resolve</Button>
        </Row>
        <Row>
          <ObjectPropertiesList object={selectedDiscrepancy}/>
        </Row>
      </Col>
    </Container>
  )
}
