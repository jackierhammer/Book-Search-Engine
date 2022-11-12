import React from 'react';
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
// added apollo client import
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// here we make a new apollo client
const client = new ApolloClient({
  request: (operation) => {
    // grab token from local storage
    const token = localStorage.getItem('id_token');
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    })
  },
  uri: '/graphql'
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Navbar>
          <Switch>
            <Route exact path='/' component={SearchBooks} />
            <Route exact path='/saved' component={SavedBooks} />
            <Route render={() => <h1 className='display-2'>Wrong Page</h1>} />
          </Switch>
        </Navbar>
      </Router>
    </ApolloProvider>
  );
}

export default App;
