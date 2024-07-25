import React from 'react'

export default function SmallPage({ children }) {
  return (
    <div style={{display: 'flex', flexFlow: 'column', alignItems: 'center'}}>
      {children}
    </div>
  )
}
