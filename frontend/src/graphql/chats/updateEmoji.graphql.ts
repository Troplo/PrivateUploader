import { gql } from "@apollo/client/core";

export const UpdateEmojiMutation = gql`
  mutation UpdateEmoji($input: UpdateEmojiInput!) {
    updateEmoji(input: $input) {
      name
    }
  }
`;
