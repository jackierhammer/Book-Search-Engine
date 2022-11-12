const express = require('express');
const path = require('path');

// imports type defs and resolvers
const { typeDefs, resolvers } = require('./schemas');

// imports database connection
const db = require('./config/connection');

// imports apollo server
const { ApolloServer } = require('apollo-server-express');

// imports authMiddleware from auth
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// create apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});
// since we are using an Apollo Server 2 version before 3, we don't have to use server.start() first
server.applyMiddleware({ app });

// changed true to false 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
};

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  })
});
