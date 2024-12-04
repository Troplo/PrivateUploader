import { gql } from "@apollo/client/core";

export const EditMessageMutation = gql`
  mutation EditMessage($input: EditMessageInput!) {
    editMessage(input: $input) {
      id
    }
  }
`;
