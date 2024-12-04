import { gql } from "@apollo/client/core";

const EditMessageMutation = gql`
  mutation EditMessage($input: EditMessageInput!) {
    editMessage(input: $input) {
      id
    }
  }
`;
