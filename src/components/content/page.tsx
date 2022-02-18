import React from 'react'
import './page.css'

interface Props {
  title: string
  grid?: boolean
  error: string | number | null
  children: React.ReactNode
}

const Page = ({ title, grid, error, children }: Props) => {
  return (
    <div className='page'>
      <div className='page-title'>
        <p>{title}</p>
      </div>
      <div className={`page-content ${grid && 'grid'}`}>
        {children}
      </div>
      {error && <h2 className='error'>{error}</h2>}
    </div>
  )
}

export default Page