import { gql } from "@apollo/client/core";

const TypingSubscription = gql`
  subscription TypingEvent {
    onTyping {
      chatId
      expires
      userId
    }
  }
`;

const CancelTypingSubscription = gql`
  subscription CancelTypingEvent {
    onCancelTyping {
      chatId
      expires
      userId
    }
  }
`;
