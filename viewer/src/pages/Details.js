import React from 'react'
import useSelectedDiscrepancy from '../hooks/useSelectedDiscrepancy'
import { useNavigate } from 'react-router-dom'
import ObjectPropertiesList from '../components/ObjectPropertiesList'

export default function Details() {
  const selectedDiscrepancy = useSelectedDiscrepancy()[0]
  const navigate = useNavigate()

  if (selectedDiscrepancy === null) {
    navigate('/')
  }

  return (
    <ObjectPropertiesList object={selectedDiscrepancy}/>
  )
}
