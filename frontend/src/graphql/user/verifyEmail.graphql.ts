import { gql } from "@apollo/client/core";

export const VerifyEmailMutation = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token)
  }
`;

export const SendEmailVerificationMutation = gql`
  mutation SendVerificationEmail {
    resendVerificationEmail
  }
`;
