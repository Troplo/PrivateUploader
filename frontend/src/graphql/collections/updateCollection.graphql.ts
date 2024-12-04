import { gql } from "@apollo/client/core";

const UpdateCollectionMutation = gql`
  mutation UpdateCollection($input: UpdateCollectionInput!) {
    updateCollection(input: $input) {
      shareLink
      name
      id
    }
  }
`;
