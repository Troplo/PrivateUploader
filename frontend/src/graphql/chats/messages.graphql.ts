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

export const MessagesQuery = gql`
  ${StandardMessageFragment}
  query Messages($input: InfiniteMessagesInput!) {
    messages(input: $input) {
      ...StandardMessage
    }
  }
`;

export const PagedMessagesQuery = gql`
  ${StandardMessageFragment}
  ${PagerFragment}
  query PagedMessages($input: PagedMessagesInput!) {
    messagesPaged(input: $input) {
      items {
        ...StandardMessage
      }
      pager {
        ...Pager
      }
    }
  }
`;
