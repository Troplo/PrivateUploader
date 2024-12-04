import { gql } from "@apollo/client/core";

const DeleteGroupMutation = gql`
  mutation DeleteGroup($input: DangerZoneChatInput!) {
    deleteGroup(input: $input) {
      success
    }
  }
`;

const LeaveGroupMutation = gql`
  mutation LeaveChat($input: LeaveChatInput!) {
    leaveChat(input: $input) {
      success
    }
  }
`;
