import { gql } from "@apollo/client/core";

const ChangeUsernameMutation = gql`
  mutation ChangeUsername($input: ChangeUsernameInput!) {
    changeUsername(input: $input)
  }
`;

const ChangeUserPasswordMutation = gql`
  mutation ChangeUserPassword($input: ChangePasswordInput!) {
    changeUserPassword(input: $input)
  }
`;

const ChangeUserEmailMutation = gql`
  mutation ChangeUserEmail($input: ChangeEmailInput!) {
    changeUserEmail(input: $input)
  }
`;
