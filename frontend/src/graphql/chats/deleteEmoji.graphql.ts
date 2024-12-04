import { gql } from "@apollo/client/core";

export const DeleteEmojiMutation = gql`
  mutation DeleteEmoji($input: DeleteEmojiInput!) {
    deleteEmoji(input: $input) {
      success
    }
  }
`;
