import { gql } from "@apollo/client/core";

const ToggleUserRankMutation = gql`
  mutation ToggleUserRank($input: AddRank!) {
    toggleUserRank(input: $input) {
      success
    }
  }
`;
