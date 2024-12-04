import { gql } from "@apollo/client/core";

export const DeleteChatRankMutation = gql`
  mutation DeleteChatRank($input: DeleteRank!) {
    deleteChatRank(input: $input) {
      success
    }
  }
`;
