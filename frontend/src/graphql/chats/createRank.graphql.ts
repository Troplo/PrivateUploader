import { gql } from "@apollo/client/core";

const CreateRankMutation = gql`
  mutation CreateChatRank($input: CreateRank!) {
    addChatRank(input: $input) {
      id
    }
  }
`;
