import { gql } from "@apollo/client/core";

export const AddOauthUserMutation = gql`
  mutation AddOauthUser($input: AddAppUserInput!) {
    addOauthUser(input: $input) {
      id
    }
  }
`;

export const UpdateOauthAppMutation = gql`
  mutation UpdateOauthApp($input: UpdateAppInput!) {
    updateOauthApp(input: $input) {
      success
    }
  }
`;

export const DeleteOauthAppMutation = gql`
  mutation DeleteOauthApp($input: MyAppInput!) {
    deleteOauthApp(input: $input) {
      success
    }
  }
`;

export const ResetOauthAppSecretMutation = gql`
  mutation ResetOauthSecret($input: MyAppInput!) {
    resetOauthSecret(input: $input) {
      success
    }
  }
`;
export const UpdateOauthUserMutation = gql`
  mutation UpdateOauthUser($input: UpdateAppUserInput!) {
    updateOauthUser(input: $input) {
      id
    }
  }
`;
