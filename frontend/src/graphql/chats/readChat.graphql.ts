import { gql } from "@apollo/client/core";

export const ReadChatMutation = gql`
  mutation ReadChat($input: ReadChatInput!) {
    readChat(input: $input) {
      success
    }
  }
`;
