import { gql } from "@apollo/client/core";

export const AddWorkspaceUserMutation = gql`
  mutation AddWorkspaceUser($input: WorkspaceUserInput!) {
    addWorkspaceUser(input: $input) {
      id
    }
  }
`;
