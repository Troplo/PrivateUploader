import { gql } from "@apollo/client/core";

const TransferCollectionOwnership = gql`
  mutation TransferCollectionOwnership(
    $input: TransferCollectionOwnershipInput!
  ) {
    transferCollectionOwnership(input: $input) {
      success
    }
  }
`;
