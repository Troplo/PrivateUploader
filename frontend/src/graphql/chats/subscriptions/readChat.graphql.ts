import { gql } from "@apollo/client/core";

const ReadChatSubscription = gql`
  subscription OnReadChat {
    onReadChat
  }
`;
