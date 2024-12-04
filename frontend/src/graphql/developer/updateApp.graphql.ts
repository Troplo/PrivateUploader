import { gql } from "@apollo/client/core";

const AddOauthUserMutation = gql`
  mutation AddOauthUser($input: AddAppUserInput!) {
    addOauthUser(input: $input) {
      id
    }
  }
`;

const UpdateOauthAppMutation = gql`
  mutation UpdateOauthApp($input: UpdateAppInput!) {
    updateOauthApp(input: $input) {
      success
    }
  }
`;

const DeleteOauthAppMutation = gql`
  mutation DeleteOauthApp($input: MyAppInput!) {
    deleteOauthApp(input: $input) {
      success
    }
  }
`;

const ResetOauthAppSecretMutation = gql`
  mutation ResetOauthSecret($input: MyAppInput!) {
    resetOauthSecret(input: $input) {
      success
    }
  }
`;
const UpdateOauthUserMutation = gql`
  mutation UpdateOauthUser($input: UpdateAppUserInput!) {
    updateOauthUser(input: $input) {
      id
    }
  }
`;
