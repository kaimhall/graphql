import { gql } from '@apollo/client'

export const GET_GENRES = gql`
  query {
    allBooks{
      genres
    }
  }
`
export const ALL_BOOKS = gql`
  query allBooks($author:String, $genre:String) {
    allBooks(author:$author, genre:$genre) {
      title
      author {
        name
        id
        born
        bookCount
      }
      published
      genres
    }
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors{
      name
      born
      bookCount
    }
  }
`

export const AUTHOR_NAMES = gql`
  query{
    allAuthors{
      name
    }
  }
`
export const ME = gql`
  query {
    me {
      username
      favoriteGenre
      id
    }
  }
`

export const ADD_BOOK = gql`
  mutation addBook(
    $title:String!, $published: Int, $author:String!, $genres:[String]
  ) {
    addBook(
      title: $title,
      published: $published,
      author: $author,
      genres: $genres
    )
    {
      title
      author {
        name
        id
        born
        bookCount
      }
      published
      genres
    }
  }
`
export const EDIT_AUTHOR = gql`
  mutation editAuthor($name:String!, $setBornTo: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $setBornTo
      )
    {
      name
      id
      born
      bookCount
    }
  }
`
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`
export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      published
      author {
        name
        id
        born
        bookCount
      }
      genres
    }
  }
`