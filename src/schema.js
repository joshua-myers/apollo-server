const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
  }

  type Query {
    user(id: Int!): User
  }

  type Mutation {
    createUser(firstName: String!, lastName: String!, email: String!): User!
  }
`;

module.exports = typeDefs;