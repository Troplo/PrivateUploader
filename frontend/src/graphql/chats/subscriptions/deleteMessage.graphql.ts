import { gql } from "@apollo/client/core";

const DeleteMessageSubscription = gql`
  subscription OnDeleteMessage {
    onDeleteMessage {
      id
      associationId
    }
  }
`;
