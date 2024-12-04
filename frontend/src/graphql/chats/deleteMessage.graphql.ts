import { gql } from "@apollo/client/core";

const DeleteMessageMutation = gql`
  mutation DeleteMessage($input: DeleteMessageInput!) {
    deleteMessage(input: $input)
  }
`;
