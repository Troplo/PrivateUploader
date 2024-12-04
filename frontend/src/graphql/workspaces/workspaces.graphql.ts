import { gql } from "@apollo/client/core";

export const WorkspacesQuery = gql`
  query Workspaces {
    workspaces {
      id
      name
      userId
      createdAt
      updatedAt
      icon
      users {
        id
        read
        write
        configure
        user {
          username
          id
          avatar
        }
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
          workspaceFolderId
          shareLink
        }
      }
    }
  }
`;
