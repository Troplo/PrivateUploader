import { gql } from "@apollo/client/core";

export const UpdateCollectionMutation = gql`
  mutation UpdateCollection($input: UpdateCollectionInput!) {
    updateCollection(input: $input) {
      shareLink
      name
      id
    }
  }
`;
