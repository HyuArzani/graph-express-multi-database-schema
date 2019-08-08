const fetch = require('node-fetch');
const {
  GraphQLList,
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType,
  GraphQLSchema,
} = require('graphql');

const LatestEvent = new GraphQLObjectType({
  name: 'schedule',
  description: '...',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve: root => root.eventId
    },
    name: {
      type: GraphQLString,
      resolve: root => root.eventName
    },
    date: {
      type: GraphQLString,
      resolve: root => root.eventDate
    }
  })
})

const EventType = new GraphQLObjectType({
  name: 'event',
  description: '...',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: root => root.eventId
    },
    name: { 
      type: GraphQLString,
      resolve: root => root.eventName
    },
    imageUrl: { 
      type: GraphQLString,
      resolve: root => root.eventImageUrl
    },
    description: { 
      type: GraphQLString,
      resolve: root => root.eventDescription
    },
    term: { 
      type: GraphQLString,
      resolve: root => root.eventTerm
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
      event: {
        type: EventType,
        args:{
          id: { type: GraphQLInt }
        },
        resolve: (root, args) => fetch(
          `${process.env.URL_EVENT}${args.id}`
        )
        .then(response => response.json())
      },
      latest: {
        type: GraphQLList(LatestEvent),
        args: {
          limit: { type: GraphQLInt },
        },
        resolve: (root, args) => fetch(
          `${process.env.URL_LATEST}${args.limit}`
        )
        .then(response => response.json())
      }
    })
  })
})