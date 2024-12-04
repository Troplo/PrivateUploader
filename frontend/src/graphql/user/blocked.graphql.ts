import { gql } from "@apollo/client/core";

const BlockedUsers = gql`
  query BlockedUsers {
    blockedUsers {
      id
      userId
      createdAt
      updatedAt
      blockedUserId
      silent
      blockedUser {
        id
        avatar
        username
      }
    }
  }
`;
