import { gql } from "@apollo/client/core";

export const UpdateChatMutation = gql`
  mutation UpdateChat($input: UpdateChatInput!) {
    updateChat(input: $input) {
      id
    }
  }
`;
