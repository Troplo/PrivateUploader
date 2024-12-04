import { gql } from "@apollo/client/core";

const UpdateShareLinkMutation = gql`
  mutation ToggleNoteShare($input: Int!) {
    toggleNoteShare(input: $input) {
      shareLink
    }
  }
`;
