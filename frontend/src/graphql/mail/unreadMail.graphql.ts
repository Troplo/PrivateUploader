import { gql } from "@apollo/client/core";

const UnreadMailQuery = gql`
  query UnreadMail {
    unreadMail
  }
`;
