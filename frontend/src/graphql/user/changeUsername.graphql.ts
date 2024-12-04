import { gql } from "@apollo/client/core";

export const ChangeUsernameMutation = gql`
  mutation ChangeUsername($input: ChangeUsernameInput!) {
    changeUsername(input: $input)
  }
`;

export const ChangeUserPasswordMutation = gql`
  mutation ChangeUserPassword($input: ChangePasswordInput!) {
    changeUserPassword(input: $input)
  }
`;

export const ChangeUserEmailMutation = gql`
  mutation ChangeUserEmail($input: ChangeEmailInput!) {
    changeUserEmail(input: $input)
  }
`;
