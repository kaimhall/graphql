import { useQuery } from "@apollo/client"
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_AUTHOR } from './queries'
import { ALL_AUTHORS } from "./queries"

const Edit = ({ show, results }) => {
  const { loading, error, data } = useQuery(ALL_AUTHORS)

  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      console.log(error)
    },
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        return {
          allAuthors: allAuthors.concat(response.data.editAuthor),
        }
      })
    },
  })

  if (loading) {
    return <div>loading...</div>
  }
  if (error) {
    console.log(error)
  }

  const options = data.allAuthors
    .map(a => {
      return {
        value: a.name, label: a.name
      }
    })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    const setBornTo = Number(born)
    editAuthor({ variables: { name, setBornTo } })
    setBorn('')
  }
  const handleChange = (e) => {
    e.preventDefault()
    setName(e.target.value)
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div >
          name
          <select value={name} onChange={handleChange} options={options}>
            {options.map(o => (
              <option
                key={o.label}
                value={o.value}>{o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            value={born}
            type='number'
            onChange={({ target }) => setBorn(target.value)} />
        </div>
        <button type='submit' >edit born</button>
      </form>
    </div>
  )
}
export default Edit
