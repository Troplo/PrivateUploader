import { gql } from "@apollo/client/core";

const CheckUsername = gql`
  query CheckUsername($input: CheckUsernameInput!) {
    checkUsername(input: $input)
  }
`;
