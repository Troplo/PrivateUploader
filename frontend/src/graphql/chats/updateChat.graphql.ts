import { gql } from "@apollo/client/core";

const UpdateChatMutation = gql`
  mutation UpdateChat($input: UpdateChatInput!) {
    updateChat(input: $input) {
      id
    }
  }
`;
