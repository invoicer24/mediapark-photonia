import React, { ChangeEvent, useEffect, useState, useContext } from 'react'
import './navigation.css'
import axios from 'axios'
import { StateContext } from '../../State'
import { useLocalStorage } from '../assets/customHooks/useLocalStorage'

const URL = 'https://unsplash.com/oauth'

interface Props {
  searchTerm: string
  changeSearchTerm: React.ChangeEventHandler<HTMLInputElement>
  takeSearchTerm: (p: string) => void
  handleKeypress: React.KeyboardEventHandler
  searchPhotos: () => void
  localStorage: string[]
}

const Navigation = ({ searchTerm, changeSearchTerm, takeSearchTerm, handleKeypress, searchPhotos, localStorage }: Props) => {
  const { state, dispatch } = useContext(StateContext)
  const [authToken, setAuthToken] = useLocalStorage('Bearer', null)
  
  useEffect(() => {
    let code: boolean | string | null = false
    
    if(new URLSearchParams(window.location.search).get("code")) {
      const queryParams = new URLSearchParams(window.location.search)
      code = queryParams.get("code")
    }

    if(code && !authToken) {
      axios.post(`${URL}/token?client_id=${process.env.REACT_APP_ACCESS_KEY}&client_secret=${process.env.REACT_APP_SECRET_KEY}&redirect_uri=${encodeURIComponent(process.env.REACT_APP_HOST!)}&code=${code}&grant_type=authorization_code`)
        .then(res => {
          setAuthToken(res.data.access_token)
          dispatch({ type: 'LOGIN', payload: res.data.access_token })
        }
      ).catch(err => dispatch({ type: 'SET_ERROR', payload: err.response.status }))
    }
  }, [])
 
  const [showDropdown, setShowDropdown] = useState(false)

  const pressedEnterKey = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter') {
      handleKeypress(e)
      setShowDropdown(false)
    }
  }

  const changingTerm = (e: ChangeEvent<HTMLInputElement>) => {
    changeSearchTerm(e)
    setShowDropdown(true)
  }

  return (
    <div className='navigation'>
      {/* LOGO */}
      <div className='logo'>
        <img src="images/icons/logo.svg" alt="logo" />
      </div>
      {/* SEARCH BAR */}
      <div className='search-bar'>
        <div className='search-bar-input-dropdown'>
          <input 
            type="text" 
            value={searchTerm} 
            onChange={changingTerm}
            onKeyPress={pressedEnterKey}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setShowDropdown(false)}
            className='search-bar-input' 
            placeholder='Search...'
          />
          {showDropdown && localStorage.length > 0
            && <div className='search-bar-dropdown'>
                  {localStorage.map((word: string) => <p key={word} onMouseDown={() => takeSearchTerm(word)}>{word}</p>)}
                </div>
          }
        </div>
        <div className='search-bar-button' onClick={searchPhotos}>
          <img src="images/icons/search.svg" alt="search" />
        </div>
      </div>
      {/* LOGIN / LOGOUT */}
      <div className='login-logout'>        
        {state.isAuth
          ? <p onClick={() => dispatch({ type: 'LOGOUT' })}>Log Out</p>
          : <a href={`${URL}/authorize?client_id=${process.env.REACT_APP_ACCESS_KEY}&redirect_uri=${encodeURIComponent(process.env.REACT_APP_HOST!)}&response_type=code&scope=public+write_likes+read_photos+read_user+write_user+write_photos`}><p>Log In</p></a>
        }
        
      </div>
    </div>
  )
}

export default Navigation