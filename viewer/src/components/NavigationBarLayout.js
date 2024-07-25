import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import useServerError from '../hooks/useServerError'
import Navbar from 'react-bootstrap/Navbar'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import call from '../api/call'
import status from '../api/status'
import apiDetect from '../api/detect'
import '../styles/clickable.css'
import '../styles/navbar-children-margin.css'
import '../styles/navbar-inner.css'
import '../styles/push-right.css'
import '../styles/page-outlet-container.css'

const DEFAULT_AUTO_REFRESH_INTERVAL = 10000
const FAST_AUTO_REFRESH_INTERVAL = 1000

export default function NavigationBarLayout() {
  const navigate = useNavigate()
  const [serverState, setServerState] = useState(null)
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(DEFAULT_AUTO_REFRESH_INTERVAL)
  const setServerError = useServerError()[1]
  const isFirstLoad = useRef(true)

  const refreshServerState = useCallback(() => {
    call(status)
    .then(status => {
      setServerState(status)
    })
    .catch(error => {
      console.log(`There was an error getting server state: ${error}`)
      setServerState(null)
    })
  }, [setServerState])

  useEffect(() => {
    if (!isFirstLoad.current) {
      return
    }
    isFirstLoad.current = false
    refreshServerState()
  }, [isFirstLoad, refreshServerState])

  useEffect(() => {
    const refresher = setInterval(() => {
      refreshServerState()
    }, [autoRefreshInterval])
    return () => clearInterval(refresher)
  }, [refreshServerState, autoRefreshInterval])

  useEffect(() => {
    if (serverState === null) {
      return
    }
    setAutoRefreshInterval(serverState.detect_progress_percent === null ? DEFAULT_AUTO_REFRESH_INTERVAL : FAST_AUTO_REFRESH_INTERVAL)
  }, [serverState, setAutoRefreshInterval])

  const detect = useCallback(() => {
    call(apiDetect)
    .catch(error => {
      setServerError(error)
      navigate('server-error')
    })
  }, [setServerError, navigate])

  return (
    <>
      <Navbar sticky='top' className='bg-body-tertiary navbar-children-margin' style={{display: 'inline'}}>
        <Row style={{background: 'lawngreen', margin: '0px'}}>
          <Col className='navbar-inner'>
            <Navbar.Brand className='clickable' onClick={evt => navigate('/')}>Discrepancies Viewer</Navbar.Brand>
            {
              serverState === null ?
              <Badge className='clickable' bg='danger'>Server state unkown</Badge> :
              <>
                <Badge className='clickable' onClick={refreshServerState}>Server OK</Badge>
                {
                  serverState.last_detect === null ?
                  <Badge bg='danger'>Has not detected/Unkown date</Badge> :
                  <Badge>Last detection: {serverState.last_detect}</Badge>
                }
                {
                  serverState.detect_progress_percent !== null &&
                  <Badge bg='danger'>Detection Progress: {serverState.detect_progress_percent.toFixed(2)}%</Badge>
                }
              </>
            }
          </Col>
          <Col className='navbar-inner push-right' style={{marginRight: '10px'}}>
            <Button onClick={evt => navigate('/report-bug ')} variant='danger'>Report Bug</Button>
            <Button onClick={evt => navigate('/logs')}>Logs</Button>
            <Button variant='outline-warning' onClick={detect} disabled={serverState?.detect_progress_percent !== null}>Detect</Button>
            <Button variant='outline-info' onClick={evt => navigate('/help')}>?</Button>
          </Col>
        </Row>
      </Navbar>
      <div className='page-outlet-container'>
        <Outlet />
      </div>
    </>
  )
}
