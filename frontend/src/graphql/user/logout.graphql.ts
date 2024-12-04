import { gql } from "@apollo/client/core";

const LogoutMutation = gql`
  mutation Logout {
    logout
  }
`;
