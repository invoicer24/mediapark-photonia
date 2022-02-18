import { useContext } from 'react'
import './photoItem.css'
import { StateContext } from '../../../../State'
import axios from 'axios'

const URL = 'https://api.unsplash.com'

interface Props {
  id: string
  url: string
  likes: number
  isUserLiked: boolean
  alt: string
}

const PhotoItem = ({ id, url, likes, isUserLiked, alt }: Props) => {
  const { state, dispatch } = useContext(StateContext)

  // LIKE PHOTO
  const likePhoto = (photoId: string) => {
    axios.post(`${URL}/photos/${photoId}/like`, {}, {
      headers: {
        Authorization: `Bearer ${state.isAuth}`
      },
      responseType: "json"
    })
    .then(res => dispatch({ type: 'UPDATE_PHOTO', payload: res.data.photo }))
    .catch(res => console.log(res))
  }

  // DISLIKE PHOTO
  const unlikePhoto = (photoId: string) => {
    axios.delete(`${URL}/photos/${photoId}/like`, {
      headers: {
        Authorization: `Bearer ${state.isAuth}`
      }
    })
    .then(res => dispatch({ type: 'UPDATE_PHOTO', payload: res.data.photo }))
    .catch(res => console.log(res))
  }

  return (
    <div className='photo-item'>
      <div className='photo-item-element'>
        <img src={url} alt={alt} />
      </div>
      {isUserLiked
        ? <div className='photo-item-navigation' onClick={() => unlikePhoto(id)}>
            <img src="images/icons/unlike.svg" alt="unlike" />
            <p>{likes} Undo Like</p>
          </div>
        : <div className='photo-item-navigation' onClick={() => likePhoto(id)}>
            <img src="images/icons/like.svg" alt="like" />
            <p>{likes} {`${state.isAuth === '' ? '(Login to Like)' : ''}`}</p>
          </div>
      }
      
    </div>
  )
}

export default PhotoItem