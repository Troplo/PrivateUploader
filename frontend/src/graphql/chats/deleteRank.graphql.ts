import { gql } from "@apollo/client/core";

const DeleteChatRankMutation = gql`
  mutation DeleteChatRank($input: DeleteRank!) {
    deleteChatRank(input: $input) {
      success
    }
  }
`;
