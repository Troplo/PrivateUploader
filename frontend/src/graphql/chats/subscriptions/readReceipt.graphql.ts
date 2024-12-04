import { gql } from "@apollo/client/core";

export const ReadReceiptSubscription = gql`
  subscription OnReadReceipt {
    onReadReceipt {
      chatId
      associationId
      messageId
      user {
        username
        id
        avatar
      }
    }
  }
`;
