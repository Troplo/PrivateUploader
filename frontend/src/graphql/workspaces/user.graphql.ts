import { gql } from "@apollo/client/core";

const AddWorkspaceUserMutation = gql`
  mutation AddWorkspaceUser($input: WorkspaceUserInput!) {
    addWorkspaceUser(input: $input) {
      id
    }
  }
`;
