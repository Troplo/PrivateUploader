import { gql } from "@apollo/client/core";

export const UpdateCollectionUserPermissionsMutation = gql`
  mutation UpdateCollectionUserPermissions(
    $input: UpdateCollectionUserPermissionsInput!
  ) {
    updateCollectionUserPermissions(input: $input) {
      id
      recipientId
      read
      write
      configure
    }
  }
`;

export const AddCollectionUserMutation = gql`
  mutation AddCollectionUser($input: UpdateCollectionUserPermissionsInput!) {
    addCollectionUser(input: $input) {
      id
    }
  }
`;

export const RemoveCollectionUser = gql`
  mutation RemoveCollectionUser($input: RemoveCollectionUserInput!) {
    removeCollectionUser(input: $input) {
      success
    }
  }
`;
