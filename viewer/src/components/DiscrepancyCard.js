import React, { useCallback } from 'react'
import useSelectedDiscrepancy from '../hooks/useSelectedDiscrepancy'
import bestInfo from '../api/bestInfo'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import { useNavigate } from 'react-router-dom'
import '../styles/push-right.css'
import '../styles/discrepancy-card.css'
import '../styles/center-block.css'
import '../styles/center-flex.css'
import '../styles/clickable.css'

export default function DiscrepancyCard({ discrepancy }) {
  const setSelectedDiscrepancy = useSelectedDiscrepancy()[1]
  const navigate = useNavigate()

  const moreDetail = useCallback(() => {
    setSelectedDiscrepancy(discrepancy)
    navigate('/details')
  }, [discrepancy, navigate, setSelectedDiscrepancy])

  return (
    <Card className='discrepancy-card'>
      <Card.Header>
        <Row className='center-flex'>
          <Col>
            <strong>Type: </strong><label>{discrepancy.type}</label>
          </Col>
          <Col className='push-right'>
            <Image className='clickable' onClick={moreDetail} height='24' src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Infobox_info_icon.svg/1200px-Infobox_info_icon.svg.png'/>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <Card.Title>
          <label style={{textDecoration: discrepancy.resolved_by === null ? 'auto' : 'line-through'}}>
            {discrepancy.message}
          </label>
          {
            discrepancy.resolved_by !== null && <strong className='clickable' onClick={moreDetail}> Resolved</strong>
          }
        </Card.Title>
        <Card.Text>
          <label><strong>Who: </strong>{bestInfo(discrepancy).first} {bestInfo(discrepancy).last}</label><br />
          <label><strong>{discrepancy.similar.length}</strong> Similar</label>
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <Row className='center-flex'>
          <Col>
            <strong>Discovered: </strong><label>{discrepancy.discovered}</label>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  )
}
