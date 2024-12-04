import { gql } from "@apollo/client/core";

const Friends = gql`
  query Friends {
    friends {
      id
      status
      userId
      createdAt
      friendId
      user {
        username
        id
        createdAt
        administrator
        moderator
        avatar
        status
      }
    }
  }
`;
