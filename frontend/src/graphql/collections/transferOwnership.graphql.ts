import { gql } from "@apollo/client/core";

export const TransferCollectionOwnership = gql`
  mutation TransferCollectionOwnership(
    $input: TransferCollectionOwnershipInput!
  ) {
    transferCollectionOwnership(input: $input) {
      success
    }
  }
`;
