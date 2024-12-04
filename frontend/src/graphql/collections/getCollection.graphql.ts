import { gql } from "@apollo/client/core";

export const CollectionQuery = gql`
  query Collection($input: CollectionInput!) {
    collection(input: $input) {
      id
      name
      banner
      avatar
      image
      userId
      shareLink
      user {
        username
        id
        createdAt
        administrator
        moderator
        avatar
      }
      preview {
        id
        attachment {
          attachment
          id
        }
      }
      users {
        id
        collectionId
        read
        write
        configure
        accepted
        recipientId
        senderId
        identifier
        sender {
          username
          id
          createdAt
          administrator
          moderator
          avatar
        }
        user {
          username
          id
          createdAt
          administrator
          moderator
          avatar
        }
      }
      recipient {
        id
        createdAt
        updatedAt
        collectionId
        read
        write
        configure
        accepted
        recipientId
        senderId
        identifier
      }
      shared
      itemCount
      permissionsMetadata {
        write
        read
        configure
      }
    }
  }
`;
