import { gql } from "@apollo/client/core";

export const CreateNoteMutation = gql`
  mutation CreateNote($input: CreateNoteInput!) {
    createNote(input: $input) {
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
      }
      permissions {
        modify
        read
        configure
      }
    }
  }
`;
