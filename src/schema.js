const { gql } = require("apollo-server");

const typeDefs = gql`
  type Url {
    id: Int!
    url: String!
    slug: String!
  }

  type Query {
    url(id: Int!): Url
    urlBySlug(slug: String!): Url
    allUrls: [Url!]!
    urlByUrl(url: String!): Url
  }

  type Mutation {
    createUrl(url: String!, slug: String): Url!
  }
`;

module.exports = typeDefs;
