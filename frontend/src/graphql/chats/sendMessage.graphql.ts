import { gql } from "@apollo/client/core";

const SendMessageMutation = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
    }
  }
`;
