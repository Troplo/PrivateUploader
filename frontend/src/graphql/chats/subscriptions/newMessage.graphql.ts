import { gql } from "@apollo/client/core";
import { StandardMessageFragment } from "@/graphql/chats/messages.graphql";

const NewMessageSubscription = gql`
  ${StandardMessageFragment}
  subscription NewMessage {
    onMessage {
      mention
      message {
        ...StandardMessage
      }
      associationId
      chat {
        id
        recipient {
          id
          username
        }
        type
      }
    }
  }
`;
