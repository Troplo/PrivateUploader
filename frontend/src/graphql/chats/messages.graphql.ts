import { gql } from "@apollo/client/core";
import { PagerFragment } from "../fragments/pager.graphql";

export const StandardEmbedFragment = gql`
  fragment StandardEmbed on EmbedDataV2 {
    media {
      url
      proxyUrl
      attachment
      width
      height
      isInternal
      videoEmbedUrl
      upload {
        id
        createdAt
        attachment
        userId
        name
        type
        fileSize
      }
      mimeType
      type
    }
    text {
      imageProxyUrl
      text
      heading
      imageUrl
    }
    metadata {
      url
      siteName
      siteIcon
      footer
      type
      id
      restricted
    }
  }
`;

export const StandardMessageFragment = gql`
  ${StandardEmbedFragment}
  fragment StandardMessage on Message {
    id
    createdAt
    updatedAt
    chatId
    pending
    error
    userId
    content
    type
    emoji {
      name
      icon
      id
      chatId
    }
    embeds {
      ...StandardEmbed
    }
    reply {
      readReceipts {
        associationId
        user {
          id
          avatar
          username
          legacy
        }
        messageId
      }
      content
      userId
      id
      embeds {
        metadata {
          type
        }
        media {
          type
        }
      }
      user {
        username
        id
        avatar
      }
    }
    user {
      username
      id
      avatar
    }
    edited
    editedAt
    replyId
    pinned
    readReceipts {
      associationId
      user {
        id
        avatar
        username
        legacy
      }
      messageId
    }
  }
`;

const MessagesQuery = gql`
  query Messages($input: InfiniteMessagesInput!) {
    messages(input: $input) {
      id
      createdAt
      updatedAt
      pending
      error
      chatId
      userId
      content
      type
      emoji {
        name
        icon
        id
        chatId
      }
      embeds {
        ...StandardEmbed
      }
      reply {
        readReceipts {
          associationId
          user {
            id
            avatar
            username
            legacy
          }
          messageId
        }
        content
        userId
        id
        embeds {
          metadata {
            type
          }
          media {
            type
          }
        }
        user {
          username
          id
          avatar
        }
      }
      user {
        username
        id
        avatar
      }
      edited
      editedAt
      replyId
      pinned
      readReceipts {
        associationId
        user {
          id
          avatar
          username
          legacy
        }
        messageId
      }
    }
  }
`;

const PagedMessagesQuery = gql`
  ${PagerFragment}
  query PagedMessages($input: PagedMessagesInput!) {
    messagesPaged(input: $input) {
      items {
        id
        createdAt
        updatedAt
        chatId
        userId
        pending
        content
        type
        emoji {
          name
          icon
          id
          chatId
        }
        embeds {
          ...StandardEmbed
        }
        reply {
          readReceipts {
            associationId
            user {
              id
              avatar
              username
              legacy
            }
            messageId
          }
          content
          userId
          id
          embeds {
            metadata {
              type
            }
            media {
              type
            }
          }
          user {
            username
            id
            avatar
          }
        }
        user {
          username
          id
          avatar
        }
        edited
        editedAt
        replyId
        pinned
        readReceipts {
          associationId
          user {
            id
            avatar
            username
            legacy
          }
          messageId
        }
      }
      pager {
        ...Pager
      }
    }
  }
`;
