import { gql } from "@apollo/client/core";

const UpdateRankMutation = gql`
  mutation UpdateChatRank($input: UpdateRank!) {
    updateChatRank(input: $input) {
      id
    }
  }
`;

const UpdateRankOrderMutation = gql`
  mutation UpdateChatRankOrder($input: UpdateRankOrder!) {
    updateChatRankOrder(input: $input) {
      id
    }
  }
`;
