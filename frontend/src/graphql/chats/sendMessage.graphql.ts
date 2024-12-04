import { gql } from "@apollo/client/core";

export const SendMessageMutation = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
    }
  }
`;
