import { gql } from "@apollo/client/core";

const CreateCollectionMutation = gql`
  mutation CreateCollection($input: CreateCollectionInput!) {
    createCollection(input: $input) {
      id
    }
  }
`;
