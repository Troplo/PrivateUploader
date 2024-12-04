import { gql } from "@apollo/client/core";

const LeaveCollectionMutation = gql`
  mutation OnLeaveCollection($input: LeaveCollectionInput!) {
    leaveCollection(input: $input) {
      success
    }
  }
`;
