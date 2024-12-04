import { gql } from "@apollo/client/core";
import { StandardEmbedFragment } from "@/graphql/chats/messages.graphql";

const EditMessageSubscription = gql`
  ${StandardEmbedFragment}
  subscription OnMessageEdit {
    onEditMessage {
      message {
        content
        userId
        pending
        error
        edited
        id
        pinned
        editedAt
        embeds {
          ...StandardEmbed
        }
        emoji {
          id
          chatId
          name
          icon
        }
      }
      associationId
    }
  }
`;
