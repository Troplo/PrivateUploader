import { gql } from "@apollo/client/core";

const DeleteEmojiMutation = gql`
  mutation DeleteEmoji($input: DeleteEmojiInput!) {
    deleteEmoji(input: $input) {
      success
    }
  }
`;
