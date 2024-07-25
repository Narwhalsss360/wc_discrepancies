import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import SmallPage from '../components/SmallPage'
import call from '../api/call'
import reportBug from '../api/reportBug'
import '../styles/margin-children.css'

export default function ReportBug() {
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const report = useCallback(evt => {
    evt.preventDefault()
    setSubmitting(true)
    call(reportBug, message)
    .then(response => {
      alert('Successfully reported!')
      navigate('/')
    })
    .catch(error => {
      alert(`There was an erro submitting the bug report :(`)
      console.log(error)
    })
    .finally(() => setSubmitting(false))
  }, [message, navigate])

  return (
    <SmallPage>
      <Form onSubmit={report} className='margin-children' style={{width: '40%'}}>
        <Form.Control type='text' placeholder='Enter a bug report...' value={message} onChange={evt => setMessage(evt.target.value)} style={{margin: 'auto'}} />
        <Row>
          <Button type='submit' disabled={submitting} style={{width: '30%', margin: 'auto'}}>Sumbit</Button>
        </Row>
      </Form>
    </SmallPage>
  )
}
