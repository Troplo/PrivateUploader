import { gql } from "@apollo/client/core";

const UpdateCollectionUserPermissionsMutation = gql`
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

const AddCollectionUserMutation = gql`
  mutation AddCollectionUser($input: UpdateCollectionUserPermissionsInput!) {
    addCollectionUser(input: $input) {
      id
    }
  }
`;

const RemoveCollectionUser = gql`
  mutation RemoveCollectionUser($input: RemoveCollectionUserInput!) {
    removeCollectionUser(input: $input) {
      success
    }
  }
`;
