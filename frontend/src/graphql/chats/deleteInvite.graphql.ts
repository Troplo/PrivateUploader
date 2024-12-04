import { gql } from "@apollo/client/core";

export const DeleteInviteMutation = gql`
  mutation InvalidateChatInvite($input: InvalidateInviteInput!) {
    invalidateChatInvite(input: $input) {
      success
    }
  }
`;
