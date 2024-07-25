import React, { useCallback } from 'react'
import useSelectedDiscrepancy from '../hooks/useSelectedDiscrepancy'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../styles/push-right.css'
import { useNavigate } from 'react-router-dom'

export default function DiscrepancyCard({ discrepancy }) {
  const setSelectedDiscrepancy = useSelectedDiscrepancy()[1]
  const navigate = useNavigate()

  const moreDetail = useCallback(() => {
    setSelectedDiscrepancy(discrepancy)
    navigate('/details')
  }, [discrepancy, navigate, setSelectedDiscrepancy])

  return (
    <Card>
      <Card.Header>
        <Row>
          <Col>
            <label>
              Type: {discrepancy.type}
            </label>
          </Col>
          <Col className='push-right'>
            <Button onClick={moreDetail}>More Details</Button>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <Card.Title>
          {discrepancy.message}
        </Card.Title>
      </Card.Body>
    </Card>
  )
}
