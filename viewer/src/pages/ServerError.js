import React from 'react'
import ObjectPropertiesList from '../components/ObjectPropertiesList'
import useServerError from '../hooks/useServerError'
import { useNavigate } from 'react-router-dom'

export default function ServerError() {
  const serverError = useServerError()[0]
  const navigate = useNavigate()

  if (serverError === null) {
    navigate('/')
  }

  return (
      serverError instanceof Error ?
      <>
        <h1>Error</h1>
        <p>{`${serverError}`}</p>
      </> :
      <ObjectPropertiesList object={serverError}/>
  )
}
