import React, { useEffect, useContext, useState } from 'react'
import './App.css'
import Navigation from './components/navigation/navigation'
import Page from './components/content/pageTemplate'
import PhotoItem from './components/content/home/photoItem/photoItem'
import Pagination from './components/content/home/pagination/pagination'
import axios from 'axios'
import { StateContext } from './State'
import Loader from './components/assets/loader/loader'
import { useLocalStorage } from './components/assets/customHooks/useLocalStorage'

const URL = 'https://api.unsplash.com'

function App() {
  const { state, dispatch } = useContext(StateContext)

  const [searchTerm, setSearchTerm] = useState('')
  const [searchTermToShowOnTitle, setSearchTermToShowOnTitle] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [localStorageWords, setLocalStorageWords] = useLocalStorage('Words', [])
  const [authToken] = useLocalStorage('Bearer', null)

  // FETCH PHOTOS
  useEffect(() => {
    if(authToken) {
      dispatch({ type: 'LOGIN', payload: authToken })
    }
    searchPhotos(searchTerm, authToken)
  }, [dispatch, state.pageNumber])


  // SEARCH PHOTOS
  const searchPhotos = (word?: string, token?: string) => {
    setLoading(true)
    let query = ''

    if(word) {
      let lsArray = [word, ...localStorageWords]
      let lsArray__noDublicates = lsArray.filter((value, index) => lsArray.indexOf(value) === index)
      let lsArray__lastFive = lsArray__noDublicates.slice(0, 5)
      // add to local storage
      setLocalStorageWords(lsArray__lastFive)
  
      query = `&query=${word}&`
    }

    let config
    if(token || state.isAuth) {
      config = {
        headers: {
          Authorization: `Bearer ${token ? token : state.isAuth}`
        }
      }
    }
    axios.get(`${URL}${query !== '' ? '/search' : ''}/photos?${query}per_page=12&page=${state.pageNumber}&client_id=${process.env.REACT_APP_ACCESS_KEY}`, config).then(res => {
        dispatch({ type: 'SET_ERROR', payload: null })

        if(word) setSearchTermToShowOnTitle(word)

        if(res.data.results) {
          dispatch({ type: 'SET_PHOTOS', payload: res.data.results })  
        } else {
          dispatch({ type: 'SET_PHOTOS', payload: res.data })
        }
        setLoading(false)
      })
      .catch(err => dispatch({ type: 'SET_ERROR', payload: err.response.status }))
  }


  // PRESSED SEARCH BUTTON
  const handleSearchButton = () => {
    if(searchTerm !== '') {
      dispatch({ type: 'PAGE_RESET' })
      searchPhotos(searchTerm)
    }
  }


  // TAKEN SEARCH TERM FROM AUTOCOMPLETE
  const handleTakenSearchTerm = (word: string) => {
    setSearchTerm(word)
    dispatch({ type: 'PAGE_RESET' })
    searchPhotos(word)
  }


  // PRESSED ENTER KEYBOARD KEY
  const handleKeypress = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter' && searchTerm !== '') {
      dispatch({ type: 'PAGE_RESET' })
      searchPhotos(searchTerm)
    }
  }

  return (
    <div className="App">
      <Navigation
        searchTerm={searchTerm}
        changeSearchTerm={(e) => setSearchTerm(e.target.value)}
        handleKeypress={handleKeypress}
        searchPhotos={handleSearchButton}
        localStorage={localStorageWords}
        takeSearchTerm={(word) => handleTakenSearchTerm(word)}
      />
      {state.error
        && <Page title={state.error} error/>
      }
      {loading && !state.error
        ? <Loader/>
        : <>
            <Page title={searchTermToShowOnTitle && `"${searchTermToShowOnTitle}"`}>
              {state.photos.map(photo => <PhotoItem
                id={photo.id}
                key={photo.id} 
                url={photo.urls.small}
                likes={photo.likes}
                isUserLiked={photo.liked_by_user}
                alt={photo.description}/>
              )}
            </Page>
            <Pagination/>
          </>
      }
    </div>
  );
}

export default App;
