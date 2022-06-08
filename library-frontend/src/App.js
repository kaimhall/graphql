import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Edit from './components/Edit'
import LoginForm from './components/loginform'
import Recommendations from './components/recommendations'
import { ALL_BOOKS, BOOK_ADDED } from './components/queries'
import { useSubscription, useApolloClient } from '@apollo/client'

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.name
      return seen.has(k) ? false : seen.add(k)
    })
  }
  cache.updateQuery(query, ({ allPersons }) => {
    return {
      allPersons: uniqByName(allPersons.concat(addedBook)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  useEffect(() => {
    if (!token) {
      setPage('login')
    }
  }, [token])

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      window.alert(`book ${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })

  const notLogged = { display: token ? 'none' : '' }
  const logged = { display: token ? '' : 'none' }

  return (
    <div>
      <div style={logged}>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('edit')}>edit</button>
        <button onClick={() => setPage('recommendations')}>recommended</button>
        <button onClick={logout}>logout</button>
      </div>

      <div style={notLogged}>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('login')}>login</button>
      </div>

      <Authors show={page === 'authors'} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} />
      <Edit show={page === 'edit'} />
      <LoginForm show={page === 'login'} setToken={setToken} setPage={setPage} />
      <Recommendations show={page === 'recommendations'} />

    </div>
  )
}
export default App
