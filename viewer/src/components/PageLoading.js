import React from 'react'
import Spinner from 'react-bootstrap/Spinner'

export default function PageLoading() {
  return (
    <div style={{display: 'flex', justifyContent: 'center', marginTop: '20%'}}>
      <Spinner />
    </div>
  )
}
