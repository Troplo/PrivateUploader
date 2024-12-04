import { gql } from "@apollo/client/core";

const AddChatUserMutation = gql`
  mutation AddChatUsers($input: AddChatUser!) {
    addChatUsers(input: $input) {
      success
    }
  }
`;
