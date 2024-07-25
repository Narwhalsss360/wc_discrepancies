import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function range(start, stop, step = 1) {
  return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)
}

export default function Matrix({ children, columns, rowStyle = null, columnStyle = null }) {
  const rows = Math.ceil(children.length / columns)
  const index = (row, column) => row * columns + column

  return (
    <Container fluid>
      {
        range(0, rows - 1).map(row => (
          <Row key={`row:${row}`} style={rowStyle === null ? {} : rowStyle}>
            {
              range(0, columns - 1).map(column => (
                <Col key={`col:${column}`} style={columnStyle === null ? {} : columnStyle}>{children[index(row, column)]}</Col>
              ))
            }
          </Row>
        ))
      }
    </Container>
  )
}
