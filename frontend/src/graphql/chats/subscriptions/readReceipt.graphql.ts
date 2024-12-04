import { gql } from "@apollo/client/core";

const ReadReceiptSubscription = gql`
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
