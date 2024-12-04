import { gql } from "@apollo/client/core";

export const DeleteGroupMutation = gql`
  mutation DeleteGroup($input: DangerZoneChatInput!) {
    deleteGroup(input: $input) {
      success
    }
  }
`;

export const LeaveGroupMutation = gql`
  mutation LeaveChat($input: LeaveChatInput!) {
    leaveChat(input: $input) {
      success
    }
  }
`;
