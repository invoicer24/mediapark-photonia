import React, { useReducer, createContext } from 'react'

type Error = number | string | null

interface State {
  isAuth: null | string
  photos: Array<any>
  pageNumber: number
  error: Error
}

type Action = 
  | { type: 'SET_PHOTOS', payload: [] }
  | { type: 'SET_ERROR', payload: Error }
  | { type: 'PAGE_UP' }
  | { type: 'PAGE_DOWN' }
  | { type: 'PAGE_RESET' }
  | { type: 'LOGIN', payload: null | string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PHOTO', payload: {[key: string]: any}}

const initialState = {
  isAuth: null,
  photos: [],
  pageNumber: 1,
  error: null
}

export const StateContext = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
}>({
  state: initialState,
  dispatch: () => null
})

export const StateContextProvider: React.FC = ({ children }) => {
  const reducer = (state: State, action: Action) => {
    switch (action.type) {
      case 'SET_PHOTOS':
        return {
          ...state,
          photos: action.payload
        }
      case 'SET_ERROR':
        let message
        switch (action.payload) {
          case 400:
            message = 'The provided authorization grant is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.'
          break
          case 401:
            message = 'Invalid Access Token'
          break
          case 403:
            message = 'Missing permissions to perform request'
          break
          case 404:
            message = 'The requested resource doesn’t exist'
          break
          case 500 || 503:
            message = '	Something went wrong on our end'
          break
          default:
            message = null
            break
        }

        return {
          ...state,
          error: message
        }
        case 'PAGE_UP':
          return {
            ...state,
            pageNumber: state.pageNumber + 1
          }
        case 'PAGE_DOWN':
          return {
            ...state,
            pageNumber: (state.pageNumber - 1) <= 0 ? 0 : state.pageNumber - 1
          }
        case 'PAGE_RESET':
          return {
            ...state,
            pageNumber: 1
          }
          case 'LOGIN':
            return {
              ...state,
              isAuth: action.payload
            }
          case 'LOGOUT':
            localStorage.removeItem('Bearer')
            window.location.href = '/'
            return {
              ...state,
              isAuth: null
            }
          case 'UPDATE_PHOTO':
            const updatedPhotos = state.photos.map(photo => {
              if(photo.id === action.payload.id) {
                return {...photo, likes: action.payload.likes, liked_by_user: action.payload.liked_by_user}
              }
              return photo
            })

            return {
              ...state,
              photos: updatedPhotos
            }
      default:
        return { ...initialState }
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  )
}