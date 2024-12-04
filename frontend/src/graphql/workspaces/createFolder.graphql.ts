import { gql } from "@apollo/client/core";

const CreateWorkspaceFolderMutation = gql`
  mutation CreateWorkspaceFolder($input: CreateWorkspaceFolderInput!) {
    createWorkspaceFolder(input: $input) {
      id
      name
    }
  }
`;
