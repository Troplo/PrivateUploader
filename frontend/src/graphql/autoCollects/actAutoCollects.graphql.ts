import { gql } from "@apollo/client/core";

const ActAutoCollectsMutation = gql`
  mutation ActOnAutoCollects($input: ActOnAutoCollectsInput!) {
    actOnAutoCollects(input: $input) {
      success
    }
  }
`;
