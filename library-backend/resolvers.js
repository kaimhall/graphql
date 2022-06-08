const Book = require('./models/Book')
const Author = require('./models/Author')
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError } = require('apollo-server')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const User = require('./models/user')

const JWT_SECRET = 'asdjhdf321543jhASDgfd'

const resolvers = {

  Mutation: {

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      })

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },

    //params author genres
    addBook: async (root, args, { currentUser }) => {
      const allAuthors = await Author.find({})
      const author = allAuthors.find(a => a.name === args.author)

      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      if (!author) {
        const newAuthor = new Author({
          name: args.author
        })
        const newBook = new Book(
          {
            title: args.title,
            author: newAuthor,
            genres: args.genres,
            published: args.published
          }
        )
        try {
          await newBook.save()
          await newAuthor.save()
          //return newBook
        } catch (error) {
          throw new UserInputError(error, {
            invalidArgs: args,
          })
        }

        pubsub.publish('BOOK_ADDED', { bookAdded: Book })
        return newBook
      }
      else {
        const authorsBook = new Book(
          {
            title: args.title,
            author: author,
            genres: args.genres,
            published: args.published

          }
        )
        try {
          authorsBook.save()
          //return authorsBook
        } catch (error) {
          throw new UserInputError(error, {
            invalidArgs: args,
          })
        }

        pubsub.publish('BOOK_ADDED', { BookAdded: Book })
        return authorsBook
      }
    },

    //params name, setBornTo
    editAuthor: async (root, args, { currentUser }) => {
      const author = await Author.findOne({ name: args.name })
      author.born = args.setBornTo

      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      if (!author) {
        return null
      }
      return author.save()
    }
  },

  Author: {
    //search book by author
    name: (root) => root.name,
    id: (root) => root.id,
    born: (root) => root.born,
    bookCount: async (root) => {
      const author = await Author.findOne({ name: root.name })
      const books = await Book.find({ author: { $in: author } })
      return books.length
    }
  },

  Book: {
    title: (root) => root.title,
    published: (root) => root.published,
    author: async (root) => {
      const auteur = await Author.find({ _id: { $in: root.author } })
      console.log(auteur)
      return ({
        name: auteur.map(a => a.name).toString(),
        id: auteur.map(a => a._id).toString()
      })
    },
    id: (root) => root.id,
    genres: (root) => root.genres
  },

  Query: {
    bookCount: async () => Book.collection.countDocuments(),

    authorCount: async () => Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      const books = await Book.find({})

      if (args.author && args.genre) {
        const auteur = await Author.findOne({ name: args.author })
        const genreBooksByAuthor = await Book.find({ genres: { $in: ["scifi"] }, author: auteur })
        return genreBooksByAuthor
      }

      else if (args.author) {
        const auth = await Author.find({ name: { $in: args.author } })
        const book = await Book.find({ author: auth })
        return book
      }
      else if (args.genre) {
        return books
          .filter(b => b.genres.find(g => g === args.genre))
      }

      return books
    },

    allAuthors: async () => Author.find({}),

    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  },

}
module.exports = resolvers