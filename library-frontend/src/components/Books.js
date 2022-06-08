import { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "./queries"
import { GET_GENRES } from "./queries"

const Books = ({ show }) => {
  const [genre, setGenre] = useState('all')

  const { loading, error, data, refetch } = useQuery(ALL_BOOKS)

  const genreResult = useQuery(GET_GENRES)

  useEffect(() => {
    refetch({ genre: genre === 'all' ? null : genre })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genre])


  if (loading) return null
  if (error) return `Error! ${error}`
  if (!show) {
    return null
  }

  const books = data.allBooks
  const genres = []
    .concat
    .apply([], genreResult.data.allBooks
      .map(b => b.genres)).concat('all')

  const uniqueGenres = [...new Set(genres)]

  return (
    <div>
      <h2>books</h2>
      <div>in genre <strong>{genre}</strong></div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {uniqueGenres.map(g => (
          <button
            key={g}
            onClick={() => {
              setGenre(g.toString())
            }}>
            {g.toString()}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books
