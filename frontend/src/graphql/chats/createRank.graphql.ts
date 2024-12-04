import { gql } from "@apollo/client/core";

export const CreateRankMutation = gql`
  mutation AddChatRank($input: CreateRank!) {
    addChatRank(input: $input) {
      id
    }
  }
`;
