import { gql } from "@apollo/client/core";

const DeleteWorkspaceItemMutation = gql`
  mutation SaveNote($input: DeleteWorkspaceItemInput!) {
    deleteWorkspaceItem(input: $input)
  }
`;
