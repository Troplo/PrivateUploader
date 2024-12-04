import { gql } from "@apollo/client/core";

const CreateOauthAppMutation = gql`
  mutation CreateOauthApp($input: CreateAppInput!) {
    createOauthApp(input: $input) {
      id
    }
  }
`;

const CreateBotAccountMutation = gql`
  mutation CreateBotOauthApp($input: CreateBotInput!) {
    createBotOauthApp(input: $input) {
      id
    }
  }
`;
