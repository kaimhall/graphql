import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { ADD_BOOK } from './queries'
import { useMutation } from '@apollo/client'
import { ALL_BOOKS } from "./queries"
import { updateCache } from '../App'

const NewBook = (props) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const { loading, error } = useQuery(ALL_BOOKS)

  const [createBook] = useMutation(ADD_BOOK, {
    onError: (error) => {
      console.log(error)
    },
    update: (cache, response) => {
      updateCache(cache, { query: ADD_BOOK }, response.data.addPerson)
    },
  })

  if (!props.show) {
    return null
  }
  if (loading) return 'loading ..'
  if (error) return `errror ${error}`

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  const submit = async (event) => {
    event.preventDefault()
    createBook({ variables: { title, published, author, genres } })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(Number(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
