import { gql } from "@apollo/client/core";

export const LogoutMutation = gql`
  mutation Logout {
    logout
  }
`;
