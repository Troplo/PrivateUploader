import { gql } from "@apollo/client/core";

const UpdateNoteSubscription = gql`
  subscription OnUpdateNote($shareLink: String, $onUpdateNoteId: Int) {
    onUpdateNote(shareLink: $shareLink, id: $onUpdateNoteId) {
      type
      data
      blockId
      id
      userId
      shareLink
    }
  }
`;

const SaveNoteCollabPositionMutation = gql`
  mutation SaveNoteCollabPosition($input: NoteCollabPositionInput!) {
    saveNoteCollabPosition(input: $input)
  }
`;

const NoteCollabPositionSubscription = gql`
  subscription OnNoteCollabPosition($shareLink: String, $noteId: Int) {
    onNoteCollabPosition(shareLink: $shareLink, noteId: $noteId) {
      blockIndex
      position
      userId
      noteId
      shareLink
      type
    }
  }
`;
