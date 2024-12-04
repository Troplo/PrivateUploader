import { gql } from "@apollo/client/core";

export const ActAutoCollectsMutation = gql`
  mutation ActOnAutoCollects($input: ActOnAutoCollectsInput!) {
    actOnAutoCollects(input: $input) {
      success
    }
  }
`;
