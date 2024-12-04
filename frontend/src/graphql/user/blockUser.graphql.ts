import { gql } from "@apollo/client/core";

const BlockUserMutation = gql`
  mutation BlockUser($input: BlockUserInput!) {
    blockUser(input: $input) {
      success
    }
  }
`;
