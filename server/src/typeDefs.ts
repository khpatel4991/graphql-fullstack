import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    stripeId: String
    type: String!
    playerTag: String
  }

  type Query {
    me: User
  }

  type Mutation {
    createSubscription(source: String!): User!
    login(email: String!, password: String!): User
    playerTag(tag: String!): User!
    register(email: String!, password: String!): Boolean!
  }
`;
