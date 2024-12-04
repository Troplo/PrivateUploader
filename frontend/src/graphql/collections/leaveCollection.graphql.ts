import { gql } from "@apollo/client/core";

export const LeaveCollectionMutation = gql`
  mutation LeaveCollection($input: LeaveCollectionInput!) {
    leaveCollection(input: $input) {
      success
    }
  }
`;
