// imports user from models
const { User } = require('../models');
// imports signToken from auth
const { signToken } = require('../utils/auth');
// imports error from apollo server
const { AuthenticationError } = require('apollo-server-express')

// modeled query and mutations off old user-controller.js file 
const resolvers = {
    Query: {
        // gets single user data 
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user_id })
                    .select('-__v -password')
                    .populate('books');
                return userData;
            }
            // won't retreive data without permission
            throw new AuthenticationError('You need to log in.');
        }
    },
    Mutation: {
        // adds a user, signs token, and sends them back
        addUser: async (parent, args) => {
            // creates user using arguments
            const user = await User.create(args);
            // creates token 
            const token = signToken(user);
            // returns user and token
            return { token, user };
        },

        // login, sign token, and send back
        login: async (parent, { email, password }) => {
            // searches for user by email
            const user = await User.findOne({ email });
            // throws error if the email isn't associated with a user
            if (!user) {
                throw new AuthenticationError('No user found');
            }
            // checks if the password matches the user
            const correct = await user.isCorrectPassword(password);
            // throws error for wrong password
            if (!correct) {
                throw new AuthenticationError('Wrong password')
            }
            // if user and password check out, creates token
            const token = signToken(user);
            // returns user and token
            return { token, user };
        },

        // adds a book to a user's saved books 
        saveBook: async (parent, { newBook }, context) => {
            // checks if user is logged in
            if (context.user) {
                // adds the new book to the user's saved books
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: newBook } },
                    { new: true }
                );
                return updatedUser;
            }
            // won't allow book to add unless user is logged in
            throw new AuthenticationError('You need to log in.');
        },

        // removes a book from a user's saved books 
        removeBook: async (parent, { bookId }, context) => {
            // checks if user is logged in
            if (context.user) {
                // removes the selected book from the user's saved books
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );
                return updatedUser;
            }
            // won't allow book to be removed unless user is logged in
            throw new AuthenticationError('You need to log in.');
        }
    },
};

module.exports = resolvers;
