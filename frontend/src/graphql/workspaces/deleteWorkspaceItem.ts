import { gql } from "@apollo/client/core";

export const DeleteWorkspaceItemMutation = gql`
  mutation SaveNote($input: DeleteWorkspaceItemInput!) {
    deleteWorkspaceItem(input: $input)
  }
`;
