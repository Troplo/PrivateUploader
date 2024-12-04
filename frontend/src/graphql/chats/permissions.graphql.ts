import { gql } from "@apollo/client/core";

const PermissionsQuery = gql`
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
