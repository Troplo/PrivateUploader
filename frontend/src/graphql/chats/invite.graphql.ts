import { gql } from "@apollo/client/core";

export const ChatInviteQuery = gql`
  query ChatInvite($input: InviteInput!) {
    chatInvite(input: $input) {
      id
      userId
      chatId
      rankId
      createdAt
      updatedAt
      expiredAt
      invalidated
      user {
        username
        id
        createdAt
        administrator
        moderator
        avatar
      }
      chat {
        id
        name
        users {
          id
        }
        description
        background
        icon
        type
      }
      rank {
        id
        color
        name
      }
    }
  }
`;

export const GetInvitesForChatQuery = gql`
  query GetInvitesForChat($input: ChatInput!) {
    chat(input: $input) {
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

export const JoinChatInviteMutation = gql`
  mutation JoinChatFromInvite($input: JoinChatFromInviteInput!) {
    joinChatFromInvite(input: $input) {
      id
    }
  }
`;

export const CreateChatInviteMutation = gql`
  mutation CreateChatInvite($input: CreateInviteInput!) {
    createChatInvite(input: $input) {
      id
      userId
      chatId
      rankId
      createdAt
      updatedAt
      expiredAt
      invalidated
    }
  }
`;
