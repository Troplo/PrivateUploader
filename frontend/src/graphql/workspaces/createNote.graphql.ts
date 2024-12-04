import { gql } from "@apollo/client/core";

const CreateNoteMutation = gql`
  mutation CreateNote($input: CreateNoteInput!) {
    createNote(input: $input) {
      permissions {
        modify
        read
        configure
      }
      id
      createdAt
      updatedAt
      name
      data {
        version
        blocks
        time
      }
      workspaceFolderId
      shareLink
      versions {
        id
        noteId
        userId
        createdAt
        data {
          version
          blocks
          time
        }
      }
    }
  }
`;
