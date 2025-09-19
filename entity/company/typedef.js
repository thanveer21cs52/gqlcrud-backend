import { gql } from 'apollo-server';

export const typedef = gql`
type User {
  id: ID!
  name: String!
}

type Query {
  user: [User!]!
}

type Mutation {
  addUser(name: String!): User!
  editUser(id: ID!, name: String!): User!
  deleteUser(id: ID!): User!
}

type Subscription {
  userAdded: User!
  userEdited: User!
  userDeleted: User!
}

`;
