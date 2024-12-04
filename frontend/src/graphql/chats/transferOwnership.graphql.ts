import { gql } from "@apollo/client/core";

export const TransferOwnershipMutation = gql`
  mutation TransferGroupOwnership($input: TransferOwnershipInput!) {
    transferGroupOwnership(input: $input) {
      userId
    }
  }
`;
