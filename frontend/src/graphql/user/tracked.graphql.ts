import { gql } from "@apollo/client/core";

const TrackedUsers = gql`
  query TrackedUsers {
    trackedUsers {
      username
      id
      createdAt
      administrator
      moderator
      avatar
      blocked
      status
      nameColor
      bot
      nickname {
        nickname
      }
    }
  }
`;
