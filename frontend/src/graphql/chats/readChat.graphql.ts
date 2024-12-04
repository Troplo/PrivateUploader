import { gql } from "@apollo/client/core";

const ReadChatMutation = gql`
  mutation ReadChat($input: ReadChatInput!) {
    readChat(input: $input) {
      success
    }
  }
`;
