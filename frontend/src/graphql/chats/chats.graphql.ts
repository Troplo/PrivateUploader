import { gql } from "@apollo/client/core";

const ChatsQuery = gql`
  query ChatsQuery {
    chats {
      id
      description
      type
      background
      unread
      name
      userId
      icon
      createdAt
      updatedAt
      sortDate
      usersCount
      onlineCount
      recipient {
        id
      }
      typing {
        expires
        userId
      }
      association {
        id
        hidden
        chatId
        permissions
        userId
        rank
        createdAt
        lastRead
        notifications
      }
    }
  }
`;

const UserEmoji = gql`
  query UserEmoji {
    userEmoji {
      id
      userId
      chatId
      icon
      name
      createdAt
      updatedAt
    }
  }
`;

const ChatQuery = gql`
  query Chat($input: ChatInput!) {
    chat(input: $input) {
      id
      users {
        id
        chatId
        userId
        rank
        createdAt
        lastRead
        ranksMap
      }
      ranks {
        id
        color
        name
        userId
        createdAt
        chatId
        updatedAt
        managed
        index
        permissionsMap
      }
      invites {
        id
        userId
        createdAt
        rankId
        updatedAt
        expiredAt
        invalidated
      }
    }
  }
`;

const _OldChatsQuery = gql`
  query ChatsQueryOld {
    userEmoji {
      id
      userId
      chatId
      icon
      name
      createdAt
      updatedAt
    }
    chats {
      id
      description
      type
      background
      unread
      name
      userId
      icon
      createdAt
      updatedAt
      invites {
        id
        userId
        createdAt
        rankId
        updatedAt
        expiredAt
        invalidated
      }
      association {
        id
        hidden
        chatId
        permissions
        userId
        rank
        createdAt
        lastRead
        notifications
      }
      users {
        id
        chatId
        userId
        rank
        createdAt
        lastRead
        ranksMap
      }
      sortDate
      recipient {
        id
      }
      ranks {
        id
        color
        name
        userId
        createdAt
        chatId
        updatedAt
        managed
        index
        permissionsMap
      }
    }
  }
`;

const GetChatUsersQuery = gql`
  query GetChatUsers($input: ChatInput!) {
    chat(input: $input) {
      users {
        id
        chatId
        userId
        user {
          id
          username
          avatar
        }
      }
    }
  }
`;
