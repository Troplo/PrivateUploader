import { gql } from "@apollo/client/core";

const CreateWorkspaceMutation = gql`
  mutation CreateWorkspace($input: String!) {
    createWorkspace(input: $input) {
      id
      name
      userId
      createdAt
      updatedAt
      icon
      user {
        username
        id
        createdAt
        administrator
        moderator
        avatar
      }
      folders {
        id
        createdAt
        updatedAt
        name
        workspaceId
        folderId
        children {
          id
          createdAt
          updatedAt
          name
          data {
            version
            blocks
            time
          }
          metadata {
            version
          }
          workspaceFolderId
          shareLink
          versions {
            id
            noteId
            userId
          }
          permissions {
            modify
            read
            configure
          }
        }
        workspace {
          id
          name
          userId
          createdAt
          updatedAt
          icon
        }
      }
      users {
        id
        createdAt
        updatedAt
        workspaceId
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
      }
    }
  }
`;
