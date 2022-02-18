import { useContext } from 'react'
import './pagination.css'
import { StateContext } from '../../../../State'

const Pagination = () => {
  const { state, dispatch } = useContext(StateContext)

  return (
    <div className='pagination'>
      <div 
        onClick={() => state.pageNumber !== 1 && dispatch({ type: 'PAGE_DOWN' })} 
        className={`pagination-button ${state.pageNumber === 1 && 'disabled'}`}><p>{`<`}</p>
      </div>
      <div 
        onClick={() => dispatch({ type: 'PAGE_UP' })} 
        className='pagination-button'><p>{`>`}</p>
      </div>
    </div>
  )
}

export default Pagination