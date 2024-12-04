import { gql } from "@apollo/client/core";

const UpdateEmojiMutation = gql`
  mutation UpdateEmoji($input: UpdateEmojiInput!) {
    updateEmoji(input: $input) {
      name
    }
  }
`;
