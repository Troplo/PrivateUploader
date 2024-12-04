import { gql } from "@apollo/client/core";

export const ReadChatSubscription = gql`
  subscription OnReadChat {
    onReadChat
  }
`;
