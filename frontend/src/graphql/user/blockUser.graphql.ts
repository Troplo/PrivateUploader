import { gql } from "@apollo/client/core";

export const BlockUserMutation = gql`
  mutation BlockUser($input: BlockUserInput!) {
    blockUser(input: $input) {
      success
    }
  }
`;
