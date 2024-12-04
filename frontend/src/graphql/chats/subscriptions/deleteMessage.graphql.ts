import { gql } from "@apollo/client/core";

export const DeleteMessageSubscription = gql`
  subscription OnDeleteMessage {
    onDeleteMessage {
      id
      associationId
    }
  }
`;
