import { gql } from "@apollo/client/core";

export const UserStatusSubscription = gql`
  subscription UserStatus {
    onUserStatus {
      id
      status
      platforms {
        platform
        id
        lastSeen
        status
      }
    }
  }
`;
