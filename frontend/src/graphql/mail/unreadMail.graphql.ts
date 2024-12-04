import { gql } from "@apollo/client/core";

export const UnreadMailQuery = gql`
  query UnreadMail {
    unreadMail
  }
`;
