import { gql } from "@apollo/client/core";

export const SaveNoteMutation = gql`
  mutation SaveNote($input: SaveNoteInput!) {
    saveNote(input: $input) {
      id
      name
      workspaceFolderId
    }
  }
`;

export const SaveNoteBlockMutation = gql`
  mutation SaveNoteBlock($input: UpdateNoteEventInput!) {
    saveNoteBlock(input: $input)
  }
`;
