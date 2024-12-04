import { gql } from "@apollo/client/core";

export const CreateCollectionMutation = gql`
  mutation CreateCollection($input: CreateCollectionInput!) {
    createCollection(input: $input) {
      id
    }
  }
`;
