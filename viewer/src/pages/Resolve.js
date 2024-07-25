import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useSelectedDiscrepancy from '../hooks/useSelectedDiscrepancy'
import useServerError from '../hooks/useServerError'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Row from 'react-bootstrap/Row'
import SmallPage from '../components/SmallPage'
import ObjectPropertiesList from '../components/ObjectPropertiesList'
import call from '../api/call'
import resolve from '../api/resolve'
import '../styles/margin-children.css'

export default function Resolve() {
  const selectedDiscrepancy = useSelectedDiscrepancy()[0]
  const [name, setName] = useState('')
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const setServerError = useServerError()[1]
  const navigate = useNavigate()

  useEffect(() => {
    if (selectedDiscrepancy === null) {
      navigate('/')
      return
    }

    if (selectedDiscrepancy.resolved_by !== null) {
      alert('Discrepancy already resolved')
      navigate('/')
    }
  }, [selectedDiscrepancy, navigate])

  const onSubmit = useCallback(evt => {
    if (name.trim() === '') {
      alert('Must enter Name')
      return
    }

    if (reason.trim() === '') {
      alert('Must enter Reason')
      return
    }

    selectedDiscrepancy.resolve_message = reason
    selectedDiscrepancy.resolved_by = name
    setSubmitting(true)
    call(resolve, selectedDiscrepancy)
    .then(response => {
      alert('Successfully resolved.')
      navigate('/')
    })
    .catch(error => {
      setServerError(error)
      navigate('/server-error')
    })
    .finally(() => {
      setSubmitting(false)
    })
    evt.preventDefault()
  }, [name, reason, setSubmitting, navigate, setServerError, selectedDiscrepancy])

  return (
    <SmallPage>
      <Form onSubmit={onSubmit} className='margin-children-vertical' style={{width: '50%'}}>
        <InputGroup>
          <InputGroup.Text>Name</InputGroup.Text>
          <Form.Control value={name} onChange={evt => setName(evt.target.value)} type='text'/>
        </InputGroup>
        <InputGroup>
          <InputGroup.Text>Reason</InputGroup.Text>
          <Form.Control value={reason} onChange={evt => setReason(evt.target.value)} type='text'/>
        </InputGroup>
        <Row>
          <Button type='submit' disabled={submitting} style={{width: '50%', margin: 'auto'}}>
            {
              submitting ?
              <Spinner /> :
              <>Submit</>
            }
          </Button>
        </Row>
      </Form>
      <ObjectPropertiesList object={selectedDiscrepancy}/>
    </SmallPage>
  )
}
