import { gql } from "@apollo/client/core";

export const AddToCollectionMutation = gql`
  mutation AddToCollection($input: AddToCollectionInput!) {
    addToCollection(input: $input) {
      id
    }
  }
`;

export const RemoveFromCollectionMutation = gql`
  mutation RemoveFromCollection($input: AddToCollectionInput!) {
    removeFromCollection(input: $input)
  }
`;
