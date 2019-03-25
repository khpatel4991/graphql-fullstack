import { gql } from 'apollo-server-express';

export const typeDefs = gql`

  type User {
    id: ID!
    email: String!
  }

  type Query {
    me: User
  }
  type Mutation {
    login(email: String!, password: String!): User
    register(email: String!, password: String!): Boolean!
  }
`;
