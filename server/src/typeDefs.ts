import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    playerTag: String
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): User
    playerTag(tag: String!): Boolean!
    register(email: String!, password: String!): Boolean!
    stripeCharge(token: String!): Boolean!
  }
`;
