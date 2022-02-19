import React from 'react'
import './pageTemplate.css'

interface Props {
  title: string | number
  children?: React.ReactNode
  error?: boolean
}

const Page = ({ title, children, error }: Props) => {
  return (
    <div className='page'>
      <div className={`page-title ${error ? 'error' : ''}`}>
        <p>{title}</p>
      </div>
      <div className='page-content'>
        {children}
      </div>
    </div>
  )
}

export default Page