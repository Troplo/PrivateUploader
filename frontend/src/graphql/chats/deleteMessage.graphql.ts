import { gql } from "@apollo/client/core";

export const DeleteMessageMutation = gql`
  mutation DeleteMessage($input: DeleteMessageInput!) {
    deleteMessage(input: $input)
  }
`;
