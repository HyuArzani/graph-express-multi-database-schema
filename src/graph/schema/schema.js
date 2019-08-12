const fetch = require('node-fetch');
const {
  GraphQLList,
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType,
  GraphQLSchema,
} = require('graphql');

const tryLogin = require('controllers/auth/login');
const tryRegister = require('controllers/auth/register');
const tryRefreshToken = require('controllers/auth/refreshToken');

const TokenType = new GraphQLObjectType({
  name: 'token',
  description: '...',
  fields: () => ({
    userId: {
      type: GraphQLString,
      resolve: root => root.data.userId
    },
    token: { 
      type: GraphQLString,
      resolve: root => root.data.token
    },
    refreshToken: { 
      type: GraphQLString,
      resolve: root => root.data.refreshToken
    },
  })
});

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: '...',
    fields: () => ({
      hello: {
        type: GraphQLString,
        resolve: (root, args) => {
          return 'Hello Mbut';
        }
      },
    })
  }),
  mutation: new GraphQLObjectType({
    name: "Mutation",
    description: '...',
    fields: () => ({
      login: {
        type: TokenType,
        args:{
          username: { type: GraphQLString },
          password: { type: GraphQLString },
          origin: { type: GraphQLString },
          device: { type: GraphQLString },
          os: { type: GraphQLString },
          location: { type: GraphQLString },
        },
        resolve: async (root, args) => {
          let result = await tryLogin(args);
          return result;
        }
      },
      register: {
        type: TokenType,
        args:{
          email: { type: GraphQLString },
          phone: { type: GraphQLString },
          password: { type: GraphQLString },
          fullName: { type: GraphQLString },
          identityNumber: { type: GraphQLString },
          nation: { type: GraphQLString },
          cities: { type: GraphQLString },
          gender: { type: GraphQLString },
          dateOfBirth: { type: GraphQLString },
          origin: { type: GraphQLString },

          device: { type: GraphQLString },
          os: { type: GraphQLString },
          location: { type: GraphQLString },
        },
        resolve: async (root, args) => {
          let result = await tryRegister(args);
          return result;
        }
      },
      refreshToken: {
        type: TokenType,
        args:{
          refreshToken: { type: GraphQLString },
        },
        resolve: async (root, args) => {
          let result = await tryRefreshToken(args);
          return result;
        }
      }
    })
  }),
})