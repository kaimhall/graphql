import { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "./queries"
import { ME } from "./queries"

const Recommendations = ({ show }) => {
  const [genre, setGenre] = useState(null)

  const { loading, error, data, refetch } = useQuery(ALL_BOOKS)
  const MEresult = useQuery(ME)

  useEffect(() => {
    refetch({ genre: genre })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genre])


  if (!show) {
    return null
  }
  if (loading) return 'loading ...'
  if (error) return `error! ${error}`

  if (!genre) {
    setGenre(MEresult.data.me.favoriteGenre)
  }

  const books = data.allBooks

  /*const book = [{
    title: 'test book',
    author: {
      name: 'test',
    },
    published: 1920
  }]
*/

  return (
    <div>
      <h2>recommendations</h2>
      <div>Books in your favorite genre <strong>{genre}</strong></div>
      <br></br>
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
    </div>
  )
}

export default Recommendations
