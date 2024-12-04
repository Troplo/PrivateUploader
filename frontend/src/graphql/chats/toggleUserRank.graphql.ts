import { gql } from "@apollo/client/core";

export const ToggleUserRankMutation = gql`
  mutation ToggleUserRank($input: AddRank!) {
    toggleUserRank(input: $input) {
      success
    }
  }
`;
