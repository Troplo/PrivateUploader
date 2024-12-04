import { gql } from "@apollo/client/core";

export const UpdateUserMutation = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input)
  }
`;

export const UpdateUserStatusMutation = gql`
  mutation UpdateStatus($input: UpdateUserStatusInput!) {
    updateStatus(input: $input)
  }
`;
