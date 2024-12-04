import { gql } from "@apollo/client/core";

export const UpdateShareLinkMutation = gql`
  mutation ToggleNoteShare($input: Int!) {
    toggleNoteShare(input: $input) {
      shareLink
    }
  }
`;
