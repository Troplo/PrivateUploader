import { gql } from "@apollo/client/core";

const DeleteInviteMutation = gql`
  mutation InvalidateChatInvite($input: InvalidateInviteInput!) {
    invalidateChatInvite(input: $input) {
      success
    }
  }
`;
