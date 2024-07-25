import React, { useCallback, useEffect, useRef, useState } from 'react'
import useServerError from '../hooks/useServerError'
import Badge from 'react-bootstrap/Badge'
import call from '../api/call'
import apiLogs from '../api/logs'
import { useNavigate } from 'react-router-dom'
import '../styles/navbar-children-margin.css'
import PageLoading from '../components/PageLoading'

function colorOfLevel(level) {
  if (level <= 0) {
    return 'dark'
  } else if (level <= 3) {
    return 'info'
  } else if (level <= 7) {
    return 'warning'
  } else {
    return 'danger'
  }
}

export default function Logs() {
  const [logs, setLogs] = useState(null)
  const setServerError = useServerError()[1]
  const navigate = useNavigate()
  const isFirstLoad = useRef(true)

  const refreshLogs = useCallback(() => {
    call(apiLogs)
    .then(logs => setLogs(logs))
    .catch(error => {
      setServerError(error)
      navigate('/server-error')
    })
  }, [setLogs, setServerError, navigate])

  useEffect(() => {
    if (!isFirstLoad.current) {
      return
    }
    isFirstLoad.current = false
    refreshLogs()
  }, [isFirstLoad, refreshLogs])

  return (
    logs === null ?
    <PageLoading /> :
    <ul className='navbar-children-margin'>
      {
        logs.map((log, index) => (
          <li key={`log[${index}]`}>
            <Badge bg={colorOfLevel(log.level)}>Level {log.level}</Badge>
            <Badge>{log.at}</Badge>
            <Badge>{log.sender}</Badge>
            <p>{log.message}</p>
          </li>
        ))
      }
    </ul>
  )
}
