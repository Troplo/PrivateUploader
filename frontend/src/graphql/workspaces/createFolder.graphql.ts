import { gql } from "@apollo/client/core";

export const CreateWorkspaceFolderMutation = gql`
  mutation CreateWorkspaceFolder($input: CreateWorkspaceFolderInput!) {
    createWorkspaceFolder(input: $input) {
      id
      name
    }
  }
`;
