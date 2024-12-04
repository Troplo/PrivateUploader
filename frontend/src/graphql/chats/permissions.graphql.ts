import { gql } from "@apollo/client/core";

export const PermissionsQuery = gql`
  query AvailableChatPermissions {
    availableChatPermissions {
      id
      description
      name
      createdAt
      updatedAt
      group
    }
  }
`;
