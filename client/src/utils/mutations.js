import { gql } from 'graphql-tag';

export const LOGIN_USER = gql`
    mutation loginUser($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
            }
        }
    }
`;

export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($newBook: savedBook!) {
        saveBook(newBook: $newBook) {
            _id
            username
            savedBooks {
                bookId
                authors
                image
                link
                title
                description
            }
        }
    }
`;

export const REMOVE_BOOK = gql`
    mutation saveBook($bookId: ID!) {
        saveBook(bookId: $bookId) {
            username
            savedBooks {
                bookId
                authors
                image
                link
                title
                description
            }
        }
    }
`;