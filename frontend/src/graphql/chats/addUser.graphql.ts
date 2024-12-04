import { gql } from "@apollo/client/core";

export const AddChatUserMutation = gql`
  mutation AddChatUsers($input: AddChatUser!) {
    addChatUsers(input: $input) {
      success
    }
  }
`;
