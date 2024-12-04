import { gql } from "@apollo/client/core";

export const MailStateQuery = gql`
  query MailStateQuery {
    unreadMail
    mailboxes {
      path
      name
      delimiter
      flags
      specialUse
      listed
      subscribed
    }
  }
`;
