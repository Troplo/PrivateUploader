import { gql } from "@apollo/client/core";

const TransferOwnershipMutation = gql`
  mutation TransferGroupOwnership($input: TransferOwnershipInput!) {
    transferGroupOwnership(input: $input) {
      userId
    }
  }
`;
